class Internal::ListingsController < ApplicationController
  before_action :doorkeeper_authorize!, :set_current_user
  before_action :set_campsite, only: [:update, :destroy]

  def index
    records = @current_user.administered_campsites
      .where(deleted_at: nil)
      .includes(
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
      .order(created_at: :desc)
      .page(params[:page])
      .per(params[:limit])

    listings = render_serializer(Internal::ListingsSerializer, records)

    render json: listings, status: listings[:code] || 200
  end

  def create
    record = Campsite.new(campsite_params)
    admin = CampsitesAdmin.new(user: @current_user, campsite: record)

    record.admins << admin

    if record.valid? && admin.valid?
      ActiveRecord::Base.transaction do
        record.save
        admin.save
      end

      campsite_json = render_serializer(CampsiteSerializer, record)
      render json: campsite_json, status: :ok
    else
      campsite_json = error_json(400, record.errors.full_messages + admin.errors.full_messages)
      render json: campsite_json, status: 400
    end
  end

  def update
    if @record.update(campsite_params)
      # TODO: Handle bulk update images
      campsite = render_serializer(CampsiteSerializer, @record)
      render json: campsite, status: campsite[:code] || 200
    else
      campsite = error_json(400, @record.errors.full_messages)
      render json: campsite, status: campsite[:code] || 400
    end
  end

  def destroy
    # soft delete instead of hard delete
    if @record.update(deleted_at: Time.now)
      render_success
    else
      campsite = error_json(400, @record.errors.full_messages)
      render json: campsite, status: campsite[:code] || 400
    end
  end

  private

  def set_campsite
    @record = @current_user.administered_campsites
      .where(deleted_at: nil)
      .find_by(id: params[:id].to_i)

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
