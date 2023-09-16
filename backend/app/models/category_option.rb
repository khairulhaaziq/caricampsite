class CategoryOption < ApplicationRecord
  has_many :campsites_category_options
  has_many :campsites, through: :campsites_category_options

  validates :name, presence: true, uniqueness: true
end
