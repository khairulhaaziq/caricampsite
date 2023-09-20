class Campsite < ApplicationRecord
  include Filterable

  before_save :set_attachments_name
  after_save :delete_cache
  before_destroy :delete_cache

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

  validates :title, presence: true
  validates :description, presence: true
  validates :slug, presence: true
  validates :slug, uniqueness: true
  validate :images_not_empty
  validates :cover_image, presence: true
  # validates :campsite_fee, presence: true
  # validates :campsite_address, presence: true
  validates :admins, presence: true

  accepts_nested_attributes_for :campsite_fee, update_only: true
  accepts_nested_attributes_for :campsite_address, update_only: true
  accepts_nested_attributes_for :campsite_location, update_only: true
  accepts_nested_attributes_for :attachments

  scope :filter_by_verified, ->(value) { where(is_verified: value) }
  scope :filter_by_state, ->(value) { joins(:campsite_address).where(campsite_addresses: {state: value}) }
  scope :filter_by_q, ->(title) { where("title ILIKE ?", "%#{title}%") }
  scope :filter_by_categories, ->(values) {
    joins(campsites_category_options: :category_option)
      .where(category_options: {name: values.split(",")})
  }
  scope :filter_by_features, ->(values) {
    joins(campsites_feature_options: :feature_option)
      .where(feature_options: {name: values.split(",")})
  }
  scope :filter_by_amenities, ->(values) {
    joins(campsites_amenity_options: :amenity_option)
      .where(amenity_options: {name: values.split(",")})
  }
  scope :filter_by_activities, ->(values) {
    joins(campsites_activity_options: :activity_option)
      .where(activity_options: {name: values.split(",")})
  }
  scope :filter_by_accessibility_features, ->(values) {
    joins(campsites_accessibility_feature_options: :accessibility_feature_option)
      .where(accessibility_feature_options: {name: values.split(",")})
  }

  private

  def assign_slug
    return if slug.present?
    if title.blank?
      self.slug = SecureRandom.alphanumeric(5).downcase
      return
    end

    slug = title.parameterize.downcase

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

  def set_attachments_name
    if saved_changes["title"]
      attachments.each do |attachment|
        attachment.set_name
        attachment.save
      end
    end
  end

  def delete_cache
    collection_cache_keys = [
      "/api/v1/campsites"
    ]

    collection_cache_keys.each do |collection_cache_key|
      CacheDeleteService.new(collection_cache_key, true).process
    end
  end
end
