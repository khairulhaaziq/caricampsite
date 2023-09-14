class HealthCheckController < ApplicationController
  def index
    render json: { status: 'ok' }, status: 200
  end
end
