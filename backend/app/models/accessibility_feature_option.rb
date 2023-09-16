class AccessibilityFeatureOption < ApplicationRecord
  has_many :campsites_accessibility_feature_options
  has_many :campsites, through: :campsites_accessibility_feature_options

  validates :name, presence: true, uniqueness: true
end
