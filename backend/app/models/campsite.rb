class Campsite < ApplicationRecord
  include Filterable

  enum status: {
    open_for_public: 0,
    open_for_booking: 1,
    closed_temporarily: 2,
    closed: 3
  }, _prefix: :status

  has_many :visits
  has_many :reviews
  has_many :favourites
  has_many :campsites_admins
  has_many :admins, through: :campsites_admins, source: :user
  has_many :campsites_categories
  has_many :categories, through: :campsites_categories
  has_many :campsites_features
  has_many :features, through: :campsites_features
  has_many :campsites_amenities
  has_many :amenities, through: :campsites_amenities
  has_many :campsites_activities
  has_many :activities, through: :campsites_activities
  has_many :campsites_accessibilities
  has_many :accessibility_features, through: :campsites_accessibilities

  has_one :campsite_fee
  has_one :campsite_address
  has_one :campsite_location

  before_validation :assign_slug, on: :create

  validates :name, presence: true
  validates :description, presence: true
  validates :slug, presence: true
  validates :slug, uniqueness: true
  validates :images, presence: true
  validates :cover_image, presence: true
  validates :campsite_fee, presence: true
  validates :campsite_address, presence: true
  validates :campsites_admins, presence: true
  validates :campsites_categories, presence: true
  validates :campsites_features, presence: true
  validates :campsites_amenities, presence: true
  validates :campsites_activities, presence: true
  validates :campsites_accessibilities, presence: true

  scope :filter_by_verified, ->(value) { where(is_verified: value) }
  scope :filter_by_state, ->(value) { joins(:campsite_address).where(campsite_addresses: {state: value}) }

  private

  def assign_slug
    self.slug ||= name.parameterize.downcase if name.present?
  end
end
