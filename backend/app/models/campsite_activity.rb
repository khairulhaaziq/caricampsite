class CampsiteActivity < ApplicationRecord
  enum activity: {
    hiking: 0,
    biking: 1,
    fishing: 2,
    boating: 3,
    bird_watching: 4,
    canoeing: 5,
    kayaking: 6,
    swimming: 7,
    wildlife_viewing: 8,
    stargazing: 9,
    photography: 10,
    rock_climbing: 11,
    horseback_riding: 12,
    picnicking: 13,
    geocaching: 14,
    hunting: 15,
    campfire: 16,
    archery: 17,
    nature_programs: 18,
    orienteering: 19,
    backpacking: 20,
    caving: 21,
    cross_country_skiing: 22,
    snowshoeing: 23,
    snowmobiling: 24,
    off_roading: 25,
    ice_fishing: 26,
    sled_dog_mushing: 27,
    water_skiing: 28,
    wind_surfing: 29,
    tubing: 30
  }

  belongs_to :campsite

  validates :activity, presence: true
end
