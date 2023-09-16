class CampsiteFee < ApplicationRecord
  belongs_to :campsite

  validates :from, presence: true
  validates :to, presence: true
end
