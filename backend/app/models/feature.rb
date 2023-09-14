class Feature < ApplicationRecord
  validates :name, presence: true
  has_many :campsites_features
  has_many :campsites, through: :campsites_features
end
