class Api::V1::CampsitesController < ApplicationController
  before_action :doorkeeper_authorize!, :set_current_user, only: [:create, :update, :destroy]
  before_action :ensure_record_exists, only: [:show]
  before_action :set_campsite_by_current_user, only: [:update, :destroy]

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

      render_serializer(CampsiteSerializer, records)
    end

    render json: campsites, status: campsites[:code] || 200
  end

  def show
    campsite = render_serializer(CampsiteSerializer, @record)

    render json: campsite, status: campsite[:code] || 200
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

  def ensure_record_exists
    @record = Campsite
      .includes(
        :reviews,
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
        visits: :user,
        favourites: :user,
        admins: :user
      )
      .where(deleted_at: nil)
      .find_by(params[:slug].present? ? {slug: params[:id]} : {id: params[:id].to_i})

    render json: error_json(404), status: 404 unless @record
  end

  def set_campsite_by_current_user
    @record = @current_user.administered_campsites
      .where(deleted_at: nil)
      .find_by(id: params[:id].to_i)

    render json: error_json(404), status: 404 unless @record
  end

  def filter_params
    params.permit(:verified, :state)
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
        # social_links start
        :facebook,
        :google_embed,
        :google_map,
        :instagram,
        :tiktok,
        :twitter,
        :waze,
        :whatsapp,
        # social_links end
        # contacts start
        :contact_name1,
        :contact_mobile1,
        :contact_name2,
        :contact_mobile2,
        :contact_name3,
        :contact_mobile3,
        # contacts end
        # one
        campsite_fee_attributes: [:currency, :from, :to],
        campsite_address_attributes: [:addressLine1, :addressLine2, :city, :state, :postcode, :country],
        campsite_location_attributes: [:latitude, :longitude],
        # :admins,
        attachments_attributes: [:id, :attachment_type, :url],
        # many to many
        feature_option_ids: [],
        amenity_option_ids: [],
        activity_option_ids: [],
        category_option_ids: [],
        accessibility_feature_option_ids: []
      )
  end
end
