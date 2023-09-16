class Api::V1::ReviewsController < ApplicationController
  before_action :doorkeeper_authorize!, :set_current_user
  before_action :set_campsite
  before_action :set_review, only: [:update, :destroy]

  def create
    review = @campsite.reviews.find_by(user_id: @current_user.id)

    if review
      render json: error_json(422, "Review already exists"), status: :unprocessable_entity
    else
      review = @campsite.reviews.new(review_params.merge(user: @current_user))
      if review.save
        render_success
      else
        render json: error_json(422, review.errors.full_messages), status: :unprocessable_entity
      end
    end
  end

  def update
    if @review.update(review_params)
      render_success
    else
      render json: error_json(422, @review.errors.full_messages), status: :unprocessable_entity
    end
  end

  def destroy
    if @review.destroy
      render_success
    else
      render json: error_json(422, @review.errors.full_messages), status: :unprocessable_entity
    end
  end

  private

  def review_params
    params.require(:review).permit(:body, :rating, :images)
  end

  def set_campsite
    @campsite = Campsite.find(params[:campsite_id])
  end

  def set_review
    @review = @campsite.reviews.find_by(user_id: @current_user.id)
    render json: error_json(422, "Review not found"), status: :unprocessable_entity unless @review
  end
end
