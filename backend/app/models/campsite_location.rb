class CampsiteLocation < ApplicationRecord
  validates :latitude, presence: true
  validates :longitude, presence: true
  belongs_to :campsite
end
