class Feature < ApplicationRecord
  has_many :campsites_features
  has_many :campsites, through: :campsites_features

  validates :name, presence: true
end
