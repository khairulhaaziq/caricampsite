class Review < ApplicationRecord
  belongs_to :campsite
  belongs_to :user

  validates :body, presence: true
  validates :rating, presence: true
end
