class Api::V1::CampsitesController < ApplicationController
  before_action :ensure_record_exists, only: %i[update destroy]
  before_action :doorkeeper_authorize!, :set_current_user, only: [:create, :update, :destroy]
  before_action :set_campsite_by_current_user, only: [:update, :destroy]

  def index
    records = Campsite
      .filter(filter_params)
      .where(deleted_at: nil)
      .preload(
        :visits,
        :reviews,
        :favourites,
        :features,
        :admins,
        :campsite_fee,
        :campsite_address,
        :campsite_location,
        :amenities,
        :activities,
        :categories,
        :accessibility_features
      )
      .order(created_at: :desc)
      .page(params[:page])
      .per(params[:limit])

    campsites = render_serializer(CampsiteSerializer, records)
    render json: campsites, status: campsites[:code] || 200
  end

  def show
    @record = Campsite
      .preload(:visits, :reviews, :favourites, :features, :admins, :campsite_fee, :campsite_address, :campsite_location)
      .find_by(slug: params[:slug])

    if @record
      campsite = render_serializer(CampsiteSerializer, @record)
      render json: campsite, status: campsite[:code] || 200
    else
      render json: error_json(404), status: 404
    end
  end

  def create
    record = Campsite.new create_params

    if record.save
      campsite = render_serializer(CampsiteSerializer, record)
    else
      error_message = record.errors.full_messages
      campsite = error_json(400, error_message)
    end
    render json: campsite, status: campsite[:code] || 200
  end

  def update
    if @record.update(update_params)
      show
    else
      campsite = error_json(400, @record.errors.full_messages)
      render json: campsite, status: campsite[:code] || 200
    end
  end

  def destroy
    # soft delete instead of hard delete
    if @record.update(deleted_at: Time.now)
      render json: success_json, status: 200
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
        .find_by(slug: params[:id]) ||
      @current_user.administered_campsites
        .find(params[:id].to_i)
  end

  def filter_params
    params.permit(:verified, :state)
  end

  def update_params
    params.permit(:name)
  end

  def create_params
    params.permit(:name)
  end
end
