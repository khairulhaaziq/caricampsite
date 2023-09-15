class Campsite < ApplicationRecord
  include Filterable

  before_validation :assign_slug, on: :create
  validates :name, presence: true
  validates :description, presence: true
  validates :slug, presence: true
  has_many :visits
  has_many :reviews
  has_many :favourites
  has_many :campsites_admins
  has_many :admins, through: :campsites_admins, source: :user
  has_many :campsites_features
  has_many :features, through: :campsites_features
  has_one :campsite_fee
  has_one :campsite_address
  has_one :campsite_location
  enum :status, [ :open_for_public, :open_for_booking, :closed_temporarily, :closed ]

  scope :filter_by_verified, -> (value){ where(is_verified: value) }
  scope :filter_by_state, ->(value) { joins(:campsite_address).where(campsite_addresses: { state: value }) }

  private

  def assign_slug
    self.slug ||= name.parameterize.downcase if name.present?
  end
end
