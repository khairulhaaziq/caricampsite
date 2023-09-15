class Api::V1::CampsitesController < ApplicationController
  before_action :ensure_record_exists, only: %i[ show update destroy ]

  # GET /api/v1/campsites
  def index
    records = Campsite
      .filter(campsite_params)
      .where(deleted_at: nil)
      .order(created_at: :desc)
      .page(params[:page])
      .per(params[:limit])

    campsites = render_serializer(CampsiteSerializer, records)
    render json: campsites, status: campsites[:code] || 200
  end

  def show
    campsite = render_serializer(CampsiteSerializer, @record)
    render json: campsite, status: campsite[:code] || 200
  end

  def create
    record = Campsite.new group_params

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
      @record = Campsite.find(params[:id])
      render json: error_json(404), status: 404 unless @record
    end

    def campsite_params
      params.permit(
        :verified,
        :state,
      )
    end

    def update_params
      params.permit(
        :name,
      )
    end
end
