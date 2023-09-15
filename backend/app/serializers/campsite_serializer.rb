class CampsiteSerializer
  include JSONAPI::Serializer
  attributes :name, :description, :direction_instructions, :things_to_know, :slug, :images, :cover_image, :status, :is_verified, :social_links, :contacts, :visits, :reviews, :favourites, :admins, :features, :campsite_fee, :campsite_address, :campsite_location
end
