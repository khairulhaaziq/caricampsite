class Api::V1::FavouritesController < ApplicationController
  before_action :doorkeeper_authorize!, :set_current_user
  before_action :set_campsite
  before_action :set_favourite

  def create
    if @favourite.present?
      render json: error_json(422, "Favourite already exists"), status: :unprocessable_entity
    else
      favourite = @campsite.favourites.new(user: @current_user)
      if favourite.save
        render_success
      else
        render json: error_json(422, favourite.errors.full_messages), status: :unprocessable_entity
      end
    end
  end

  def destroy
    if @favourite.nil?
      render json: error_json(422, "Favourite not found"), status: :unprocessable_entity
    elsif @favourite.destroy
      render_success
    else
      render json: error_json(422, @favourite.errors.full_messages), status: :unprocessable_entity
    end
  end

  private

  def set_campsite
    @campsite = Campsite.find(params[:campsite_id])
    render json: error_json(422, "Campsite not found"), status: :unprocessable_entity unless @campsite
  end

  def set_favourite
    @favourite = @campsite.favourites.find_by(user_id: @current_user.id)
  end
end
