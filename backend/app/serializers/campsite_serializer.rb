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
    :visits,
    :reviews,
    :favourites,
    :features
  )

  attribute :campsite_address do |obj|
    obj.campsite_address.slice(:id)
  end

  attribute :campsite_fee do |obj|
    obj.campsite_fee.slice(:id)
  end

  attribute :campsite_location do |obj|
    obj.campsite_location.slice(:id)
  end
end
