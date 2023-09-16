class CampsiteAmenity < ApplicationRecord
  enum amenity: {
    swimming_pool: 0,
    wifi: 1,
    restaurant: 2,
    playground: 3,
    shower_facility: 4,
    toilet_facility: 5,
    picnic_area: 6,
    campfire_area: 7,
    hiking_trails: 8,
    fishing: 9,
    cycling: 10,
    boating: 11,
    wildlife_viewing: 12,
    pet_friendly: 13,
    RV_hookups: 14,
    electricity_hookups: 15,
    laundry_facility: 16,
    camp_store: 17,
    showers: 18,
    restrooms: 19,
    dump_station: 20,
    picnic_tables: 21,
    fire_pits: 22,
    barbecue_grills: 23,
    drinking_water: 24
  }

  belongs_to :campsite

  validates :amenity, presence: true
end
