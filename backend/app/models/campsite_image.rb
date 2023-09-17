class CampsiteImage < ApplicationRecord
  belongs_to :campsite

  validates :image_url, presence: true
end
