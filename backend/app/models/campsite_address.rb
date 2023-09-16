class CampsiteAddress < ApplicationRecord
  belongs_to :campsite

  validates :addressLine1, presence: true
  validates :city, presence: true
  validates :postcode, presence: true
  validates :state, presence: true
end
