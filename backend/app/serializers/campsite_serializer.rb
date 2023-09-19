class CampsiteSerializer
  include JSONAPI::Serializer

  attributes(
    :id,
    :title,
    :description,
    :direction_instructions,
    :notes,
    :slug,
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
    :attachments
  )

  attribute :visits do |obj|
    obj.visits.map { |x| x.user }
  end

  attribute :visits_users do |obj|
    obj.visits.map { |x| x.user.id }
  end

  attribute :favourites do |obj|
    obj.favourites.map { |x| x.user }
  end

  attribute :favourites_users do |obj|
    obj.favourites.map { |x| x.user.id }
  end

  attribute :reviews do |obj|
    obj.reviews.map do |review|
      user = User.where(id: review.user_id).first
      review.attributes.merge(user: {id: user.id, email: user.email})
    end
  end

  attribute :reviews_users do |obj|
    obj.reviews.map { |x| x.user.id }
  end

  attribute :admins do |obj|
    obj.admins.map { |x| x.user }
  end

  attribute :feature_options do |obj|
    obj.feature_options.map { |x| x.name }
  end

  attribute :amenity_options do |obj|
    # obj.amenities.map { |x|
    #   {**x.attributes.symbolize_keys, name: x.amenity_option.name} # demo spread
    #   {**x.slice(:id), name: x.amenity_option.name} # demo selective
    # }
    obj.amenity_options.map { |x| x.name }
  end

  attribute :activity_options do |obj|
    obj.activity_options.map { |x| x.name }
  end

  attribute :category_options do |obj|
    obj.category_options.map { |x| x.name }
  end

  attribute :accessibility_feature_options do |obj|
    obj.accessibility_feature_options.map { |x| x.name }
  end

  attribute :rating do |obj|
    if obj.reviews.present?
      total_rating = obj.reviews.sum(&:rating)
      (total_rating.to_f / obj.reviews.length).round(2)
    else
      0  # Default to 0 if there are no reviews
    end
  end

  attribute :images do |obj|
    obj.attachments.map { |x| x.url }
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
