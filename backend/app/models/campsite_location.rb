class CampsiteLocation < ApplicationRecord
  belongs_to :campsite

  validates :latitude, presence: true
  validates :longitude, presence: true
end
