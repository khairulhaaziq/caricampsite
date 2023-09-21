class Review < ApplicationRecord
  after_save :delete_campsite_cache
  before_destroy :delete_campsite_cache

  belongs_to :campsite
  belongs_to :user

  validates :body, presence: true
  validates :rating, presence: true

  def delete_campsite_cache
    Campsite.delete_campsite_cache
  end
end
