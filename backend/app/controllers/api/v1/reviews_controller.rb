class Api::V1::ReviewsController < ApplicationController
  before_action :set_review, only: %i[show update destroy]

  # GET /api/v1/reviews
  def index
    @reviews = Review.all

    render json: @reviews
  end

  # GET /api/v1/reviews/1
  def show
    render json: @review
  end

  # POST /api/v1/reviews
  def create
    @review = Review.new(review_params)

    if @review.save
      render json: @review, status: :created, location: @review
    else
      render json: @review.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/reviews/1
  def update
    if @review.update(review_params)
      render json: @review
    else
      render json: @review.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/reviews/1
  def destroy
    @review.destroy
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_review
    @review = Review.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def review_params
    params.fetch(:review, {})
  end
end
