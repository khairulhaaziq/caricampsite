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
  has_many :campsite_categories
  has_many :categories, through: :campsite_categories
  has_many :campsites_features
  has_many :features, through: :campsites_features
  has_many :campsite_amenities
  has_many :amenities, through: :campsite_amenities
  has_many :campsite_activities
  has_many :activities, through: :campsite_activities
  has_many :campsite_accessibilities
  has_many :accessibility_features, through: :campsite_accessibilities

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
  # validates :campsite_fee, presence: true
  # validates :campsite_address, presence: true
  # validates :campsites_admins, presence: true
  # validates :campsite_categories, presence: true
  # validates :campsites_features, presence: true
  # validates :campsite_amenities, presence: true
  # validates :campsite_activities, presence: true
  # validates :campsite_accessibilities, presence: true

  scope :filter_by_verified, ->(value) { where(is_verified: value) }
  scope :filter_by_state, ->(value) { joins(:campsite_address).where(campsite_addresses: {state: value}) }

  private

  def assign_slug
    return if slug.present?
    if name.blank?
      self.slug = SecureRandom.alphanumeric(5).downcase
      return
    end

    slug = name.parameterize.downcase

    if Campsite.exists?(slug: slug)
      slug += "-#{SecureRandom.alphanumeric(5).downcase}"
    end

    self.slug = slug
  end
end
