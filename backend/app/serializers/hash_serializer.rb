class HashSerializer
  def self.dump(hash)
    hash.to_json if hash.is_a?(Hash)
  end

  def self.load(data)
    if data.is_a?(String)
      hash = JSON.parse(data)
      hash.with_indifferent_access
    else
      data
    end
  end
end
