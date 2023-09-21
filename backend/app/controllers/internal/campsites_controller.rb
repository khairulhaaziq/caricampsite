class Internal::CampsitesController < ApplicationController
  before_action :ensure_record_exists, only: [:show]

  def index
    campsites = fetch_cache(request.fullpath) do
      records = Campsite
        .filter(filter_params)
        .where(deleted_at: nil)
        .includes(
          :reviews,
          :campsite_fee,
          :campsite_address,
          :campsite_location,
          :attachments,
          :feature_options,
          :amenity_options,
          :activity_options,
          :category_options,
          :accessibility_feature_options,
          visits: :user,
          favourites: :user,
          admins: :user
        )
        .order(created_at: :desc)
        .page(params[:page])
        .per(params[:limit])

      render_serializer(Internal::CampsitesSerializer, records)
    end

    render json: campsites, status: campsites[:code] || 200
  end

  def show
    campsite = render_serializer(Internal::CampsiteSerializer, @record)

    render json: campsite, status: campsite[:code] || 200
  end

  private

  def ensure_record_exists
    @record = Campsite
      .where(deleted_at: nil)
      .includes(
        :admins,
        :campsite_fee,
        :campsite_address,
        :campsite_location,
        :attachments,
        :feature_options,
        :amenity_options,
        :activity_options,
        :category_options,
        :accessibility_feature_options,
        reviews: :user,
        visits: :user,
        favourites: :user,
        admins: :user
      )
      .find_by(params[:slug].present? ? {slug: params[:id]} : {id: params[:id].to_i})

    render json: error_json(404), status: 404 unless @record
  end

  def filter_params
    params.permit(
      :verified,
      :state,
      :q,
      :categories,
      :features,
      :amenities,
      :activities,
      :accessbility_features
    )
  end

  def campsite_params
    params.require(:campsites)
      .permit(
        :title,
        :description,
        :direction_instructions,
        :notes,
        :cover_image,
        :status,
        :facebook,
        :google_embed,
        :google_map,
        :instagram,
        :tiktok,
        :twitter,
        :waze,
        :whatsapp,
        :contact_name1,
        :contact_mobile1,
        :contact_name2,
        :contact_mobile2,
        :contact_name3,
        :contact_mobile3,
        campsite_fee_attributes: [:currency, :from, :to],
        campsite_address_attributes: [:addressLine1, :addressLine2, :city, :state, :postcode, :country],
        campsite_location_attributes: [:latitude, :longitude],
        attachments_attributes: [:id, :attachment_type, :url],
        feature_option_ids: [],
        amenity_option_ids: [],
        activity_option_ids: [],
        category_option_ids: [],
        accessibility_feature_option_ids: []
      )
  end
end
