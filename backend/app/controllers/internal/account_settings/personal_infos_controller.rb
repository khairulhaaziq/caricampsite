class Internal::AccountSettings::PersonalInfosController < ApplicationController
  before_action :doorkeeper_authorize!, :set_current_user
  before_action :set_personal_info_by_current_user

  def show
    render json: @personal_info
  end

  def update
    if @personal_info.update(personal_info_params)
      render json: @personal_info
    else
      render json: @personal_info.errors, status: :unprocessable_entity
    end
  end

  private

  def set_personal_info_by_current_user
    @personal_info = PersonalInfo.joins(account_setting: :user).find_by(users: {id: 1})
    render json: error_json(422, "personal_info not found"), status: :unprocessable_entity unless @personal_info
  end

  def personal_info_params
    params.fetch(:personal_info, {})
  end
end
