class ActivityOption < ApplicationRecord
  has_many :campsites_activity_options
  has_many :campsites, through: :campsites_activity_options

  validates :name, presence: true, uniqueness: true
end
