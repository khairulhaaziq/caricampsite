class AmenityOption < ApplicationRecord
  has_many :campsites_amenity_options
  has_many :campsites, through: :campsites_amenity_options

  validates :name, presence: true, uniqueness: true
end
