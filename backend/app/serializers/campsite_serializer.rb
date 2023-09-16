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
    :favourites,
    # joined tables
    :admins,
    :features,
    :amenities,
    :activities,
    :categories,
    :accessibility_features
  )

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
