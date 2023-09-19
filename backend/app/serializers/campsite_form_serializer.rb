class CampsiteFormSerializer
  include JSONAPI::Serializer

  attributes(
    :id,
    :title,
    :notes,
    :direction_instructions,
    :description,
    :slug,
    :cover_image,
    :status,
    :is_verified,
    # one
    :campsite_fee,
    :campsite_address,
    :campsite_location,
    # many
    :attachments
  )

  attribute :campsite_address_attributes do |obj|
    obj.campsite_address
  end

  attribute :campsite_fee_attributes do |obj|
    obj.campsite_fee
  end

  attribute :campsite_location_attributes do |obj|
    obj.campsite_location
  end

  attribute :feature_option_ids do |obj|
    obj.feature_options.map { |x| x.id }
  end

  attribute :amenity_option_ids do |obj|
    obj.amenity_options.map { |x| x.id }
  end

  attribute :activity_option_ids do |obj|
    obj.activity_options.map { |x| x.id }
  end

  attribute :category_option_ids do |obj|
    obj.category_options.map { |x| x.id }
  end

  attribute :accessibility_feature_option_ids do |obj|
    obj.accessibility_feature_options.map { |x| x.id }
  end

  attribute :images do |obj|
    obj.attachments.map { |x| x.url }
  end

  attribute :instagram do |obj|
    obj.instagram
  end

  attribute :contact_mobile1 do |obj|
    obj.contact_mobile1
  end
end
