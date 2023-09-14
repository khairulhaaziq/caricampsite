class CampsiteAddress < ApplicationRecord
  validates :addressLine1, presence: true
  validates :city, presence: true
  validates :postcode, presence: true
  validates :state, presence: true
  belongs_to :campsite
end
