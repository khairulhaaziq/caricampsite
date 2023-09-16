class Api::V1::VisitsController < ApplicationController
  before_action :doorkeeper_authorize!, :set_current_user
  before_action :set_campsite
  before_action :set_visit, only: [:destroy]

  def create
    visit = @campsite.visits.find_by(user_id: @current_user.id)

    if visit
      render json: error_json(422, "Visit already exists"), status: :unprocessable_entity
    else
      visit = @campsite.visits.new(user: @current_user)

      if visit.save
        render_success
      else
        render json: error_json(422, visit.errors.full_messages), status: :unprocessable_entity
      end
    end
  end

  def destroy
    if @visit.destroy
      render_success
    else
      render json: error_json(422, @visit.errors.full_messages), status: :unprocessable_entity
    end
  end

  private

  def set_campsite
    @campsite = Campsite.find(params[:campsite_id])
  end

  def set_visit
    @visit = @campsite.visits.find_by(user_id: @current_user.id)
    render json: error_json(422, "Visit not found"), status: :unprocessable_entity unless @visit
  end
end
