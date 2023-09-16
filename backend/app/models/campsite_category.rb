class CampsiteCategory < ApplicationRecord
  enum category: {
    tent_camping: 0,
    rv_camping: 1,
    cabin_rentals: 2,
    glamping: 3,
    group_camping: 4,
    beach_camping: 5,
    mountain_camping: 6,
    lakefront_camping: 7,
    forest_camping: 8,
    desert_camping: 9,
    backcountry_camping: 10,
    family_friendly: 11,
    pet_friendly: 12,
    boondocking: 13,
    fishing_camping: 14,
    hunting_camping: 15,
    winter_camping: 16,
    eco_friendly: 17,
    romantic_getaway: 18,
    adventure_camping: 19,
    off_roading_camping: 20,
    solo_camping: 21,
    luxury_camping: 22,
    historical_camping: 23,
    farm_camping: 24
  }

  belongs_to :campsite

  validates :category, presence: true
end
