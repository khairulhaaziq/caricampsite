class Favourite < ApplicationRecord
  belongs_to :campsite
  belongs_to :user
end
