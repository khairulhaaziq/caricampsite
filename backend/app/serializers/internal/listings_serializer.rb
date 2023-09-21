class Internal::ListingsSerializer
  include JSONAPI::Serializer

  attributes(
    :id,
    :title,
    :slug,
    :cover_image,
    :created_at
  )

  attribute :visits do |obj|
    obj.visits.map { |x| x.user }
  end

  attribute :favourites do |obj|
    obj.favourites.map { |x| x.user }
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
end
