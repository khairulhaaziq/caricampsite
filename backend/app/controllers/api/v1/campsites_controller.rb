class Api::V1::CampsitesController < ApplicationController
  before_action :ensure_record_exists, only: [:update, :destroy]
  before_action :doorkeeper_authorize!, :set_current_user, only: [:create, :update, :destroy]
  before_action :set_campsite_by_current_user, only: [:update, :destroy]

  def index
    records = Campsite
      .filter(filter_params)
      .where(deleted_at: nil)
      .includes(
        :reviews,
        :campsite_fee,
        :campsite_address,
        :campsite_location,
        visits: :user,
        favourites: :user,
        admins: :user,
        features: :feature_option,
        amenities: :amenity_option,
        activities: :activity_option,
        categories: :category_option,
        accessibility_features: :accessibility_feature_option
      )
      .order(created_at: :desc)
      .page(params[:page])
      .per(params[:limit])

    campsites = render_serializer(CampsiteSerializer, records)
    render json: campsites, status: campsites[:code] || 200
  end

  def show
    @record = Campsite
      .includes(
        :reviews,
        :admins,
        :campsite_fee,
        :campsite_address,
        :campsite_location,
        visits: :user,
        favourites: :user,
        admins: :user,
        features: :feature_option,
        amenities: :amenity_option,
        activities: :activity_option,
        categories: :category_option,
        accessibility_features: :accessibility_feature_option
      )
      .find_by(slug: params[:slug])

    if @record
      campsite = render_serializer(CampsiteSerializer, @record)
      render json: campsite, status: campsite[:code] || 200
    else
      render json: error_json(404), status: 404
    end
  end

  def create
    record = Campsite.new(create_params)
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
    if @record.update(update_params)
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
      .preload(:visits, :reviews, :favourites, :features, :admins, :campsite_fee, :campsite_address, :campsite_location)
      .find(params[:id])
    render json: error_json(404), status: 404 unless @record
  end

  def set_campsite_by_current_user
    @record =
      @current_user.administered_campsites
        .where(deleted_at: nil)
        .find_by(slug: params[:id]) ||
      @current_user.administered_campsites
        .where(deleted_at: nil)
        .find(params[:id].to_i)
  end

  def filter_params
    params.permit(:verified, :state)
  end

  def update_params
    params.require(:campsites)
      .permit(
        :name,
        :description,
        :direction_instructions,
        :notes,
        :images,
        :cover_image,
        :status,
        :social_links,
        :contacts,
        # one
        campsite_fee_attributes: [:currency, :from, :to],
        campsite_address_attributes: [:addressLine1, :addressLine2, :city, :state, :postcode, :country],
        campsite_location_attributes: [:latitude, :longitude]
        # joined tables
        # :admins,
        # :features,
        # :amenities,
        # :activities,
        # :categories,
        # :accessibility_features
      )
  end

  def create_params
    params.require(:campsites)
      .permit(
        :name,
        :description,
        :direction_instructions,
        :notes,
        :cover_image,
        :status,
        :social_links,
        :contacts,
        images: [],
        # one
        campsite_fee_attributes: [:currency, :from, :to],
        campsite_address_attributes: [:addressLine1, :addressLine2, :city, :state, :postcode, :country],
        campsite_location_attributes: [:latitude, :longitude]
        # joined tables
        # :admins,
        # :features,
        # :amenities,
        # :activities,
        # :categories,
        # :accessibility_features
      )
  end
end
