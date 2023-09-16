class CampsiteAmenity < ApplicationRecord
  enum amenity: {
    swimming_pool: 0,
    wifi: 1,
    restaurant: 2,
    playground: 3
  }

  belongs_to :campsite

  validates :amenity, presence: true
end
