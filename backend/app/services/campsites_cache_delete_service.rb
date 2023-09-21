class CampsitesCacheDeleteService
  include Callable

  def call
    collection_cache_keys = [
      "/api/v1/campsites",
      "/internal/campsites"
    ]

    collection_cache_keys.each do |collection_cache_key|
      CacheDeleteService.new(collection_cache_key, true).process
    end
  end
end
