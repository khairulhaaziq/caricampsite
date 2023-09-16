class CampsiteAccessibility < ApplicationRecord
  enum accessibility_feature: {
    wheelchair_accessible: 0,
    pet_friendly: 1,
    hiking_trails: 2
  }

  belongs_to :campsite

  validates :accessibility_feature, presence: true
end
