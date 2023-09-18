class Campsite < ApplicationRecord
  include Filterable

  serialize :contacts, HashSerializer
  serialize :social_links, HashSerializer

  store_accessor :contacts,
    :contact_name1,
    :contact_mobile1,
    :contact_name2,
    :contact_mobile2,
    :contact_name3,
    :contact_mobile3
  store_accessor :social_links,
    :facebook,
    :google_embed,
    :google_map,
    :instagram,
    :tiktok,
    :twitter,
    :waze,
    :whatsapp

  enum status: {
    open_for_public: 0,
    open_for_booking: 1,
    closed_temporarily: 2,
    closed: 3
  }, _prefix: :status

  has_one :campsite_fee
  has_one :campsite_address
  has_one :campsite_location

  has_many :visits
  has_many :reviews
  has_many :favourites
  has_many :attachments, as: :attachable
  has_many :admins, class_name: "CampsitesAdmin", foreign_key: "campsite_id"
  has_many :campsites_feature_options
  has_many :feature_options, through: :campsites_feature_options
  has_many :campsites_amenity_options
  has_many :amenity_options, through: :campsites_amenity_options
  has_many :campsites_activity_options
  has_many :activity_options, through: :campsites_activity_options
  has_many :campsites_category_options
  has_many :category_options, through: :campsites_category_options
  has_many :campsites_accessibility_feature_options
  has_many :accessibility_feature_options, through: :campsites_accessibility_feature_options

  before_validation :assign_slug, on: :create
  before_validation :assign_cover_image, on: :create

  validates :name, presence: true
  validates :description, presence: true
  validates :slug, presence: true
  validates :slug, uniqueness: true
  validate :images_not_empty
  validates :cover_image, presence: true
  # validates :campsite_fee, presence: true
  # validates :campsite_address, presence: true
  validates :admins, presence: true
  # validates :categories, presence: true

  accepts_nested_attributes_for :campsite_fee, update_only: true
  accepts_nested_attributes_for :campsite_address, update_only: true
  accepts_nested_attributes_for :campsite_location, update_only: true

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

  def assign_cover_image
    return if cover_image.present? || attachments.blank? || attachments.all?(&:blank?)
    self.cover_image = attachments.first.url
  end

  def images_not_empty
    if attachments.blank? || attachments.all?(&:blank?)
      errors.add(:attachments, "Must contain at least one image")
    end
  end
end
