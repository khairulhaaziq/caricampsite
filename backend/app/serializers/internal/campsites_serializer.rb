class Internal::CampsitesSerializer
  include JSONAPI::Serializer

  attributes(
    :id,
    :title,
    :slug,
    :cover_image,
    :campsite_address
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

  attribute :category_options do |obj|
    obj.category_options.map { |x| x.name }
  end

  attribute :rating do |obj|
    if obj.reviews.present?
      total_rating = obj.reviews.sum(&:rating)
      average_rating = total_rating.to_f / obj.reviews.length
      formatted_rating =
        if average_rating.to_i == average_rating
          format("%.1f", average_rating)
        else
          formatted = format("%.2f", average_rating)
          formatted.sub(/\.?0+$/, "")
        end
      formatted_rating
    else
      0
    end
  end

  attribute :images do |obj|
    obj.attachments.map { |x| x.url }
  end
end
