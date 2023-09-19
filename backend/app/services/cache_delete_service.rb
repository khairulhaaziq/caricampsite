class CacheDeleteService
  def initialize(key, is_collection = false)
    @key = key
    @is_collection = is_collection
  end

  def process
    if @is_collection
      keys = Rails.cache.redis.keys.select { |k| k.include? @key }
      keys.each { |k| Rails.cache.delete(k) }
    end
    Rails.cache.delete(@key)
  end
end
