class CampsiteCategory < ApplicationRecord
  enum category: {
    tent_camping: 0,
    rv_camping: 1,
    cabin_rental: 2,
    glamping: 3
  }

  belongs_to :campsite

  validates :category, presence: true
end
