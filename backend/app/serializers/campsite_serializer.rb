class CampsiteSerializer
  include JSONAPI::Serializer

  attributes(
    :id,
    :name,
    :description,
    :direction_instructions,
    :notes,
    :slug,
    :images,
    :cover_image,
    :status,
    :is_verified,
    :social_links,
    :contacts,
    # one
    :campsite_fee,
    :campsite_address,
    :campsite_location,
    # many
    :visits,
    :reviews,
    :favourites
  )

  attribute :admins do |obj|
    obj.admins.map { |x| x.user }
  end

  attribute :amenities do |obj|
    obj.amenities.map { |x| x.amenity_option.name }
  end

  attribute :activities do |obj|
    obj.activities.map { |x| x.activity_option.name }
  end

  attribute :categories do |obj|
    obj.categories.map { |x| x.category_option.name }
  end

  attribute :features do |obj|
    obj.features.map { |x| x.feature_option.name }
  end

  attribute :accessibility_features do |obj|
    obj.accessibility_features.map { |x| x.accessibility_feature_option.name }
  end

  # attribute :campsite_address do |obj|
  #   obj.campsite_address&.slice(:id)
  # end

  # attribute :campsite_fee do |obj|
  #   obj.campsite_fee&.slice(:id)
  # end

  # attribute :campsite_location do |obj|
  #   obj.campsite_location&.slice(:id)
  # end
end
