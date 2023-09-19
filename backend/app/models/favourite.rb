class Favourite < ApplicationRecord
  after_save :delete_campsite_cache
  before_destroy :delete_campsite_cache

  belongs_to :campsite
  belongs_to :user

  def delete_campsite_cache
    collection_cache_keys = [
      "/api/v1/campsites"
    ]

    collection_cache_keys.each do |collection_cache_key|
      CacheDeleteService.new(collection_cache_key, true).process
    end
  end
end
