class FeatureOption < ApplicationRecord
  has_many :campsites_feature_options
  has_many :campsites, through: :campsites_feature_options

  validates :name, presence: true
end
