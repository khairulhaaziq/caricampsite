class Api::V1::CampsitesController < ApplicationController
  before_action :set_api_v1_campsite, only: %i[ show update destroy ]

  # GET /api/v1/campsites
  def index
    @api_v1_campsites = Campsite.all

    render json: @api_v1_campsites
  end

  # GET /api/v1/campsites/1
  def show
    render json: @api_v1_campsite
  end

  # POST /api/v1/campsites
  def create
    @api_v1_campsite = Campsite.new(api_v1_campsite_params)

    if @api_v1_campsite.save
      render json: @api_v1_campsite, status: :created, location: @api_v1_campsite
    else
      render json: @api_v1_campsite.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/campsites/1
  def update
    if @api_v1_campsite.update(api_v1_campsite_params)
      render json: @api_v1_campsite
    else
      render json: @api_v1_campsite.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/campsites/1
  def destroy
    @api_v1_campsite.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_api_v1_campsite
      @api_v1_campsite = Campsite.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def api_v1_campsite_params
      params.fetch(:api_v1_campsite, {})
    end
end
