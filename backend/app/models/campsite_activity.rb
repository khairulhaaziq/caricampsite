class CampsiteActivity < ApplicationRecord
  enum activity: {
    hiking: 0,
    biking: 1,
    fishing: 2,
    boating: 3
  }

  belongs_to :campsite

  validates :activity, presence: true
end
