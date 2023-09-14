class CampsiteFee < ApplicationRecord
  validates :from, presence: true
  validates :to, presence: true
  belongs_to :campsite
end
