Rails.application.routes.draw do
  use_doorkeeper do
    skip_controllers :authorizations, :applications, :authorized_applications
  end

  namespace :api do
    namespace :v1 do
      resources :campsites do
        resource :reviews, only: [:create, :update, :destroy]
        resource :visits, only: [:create, :destroy]
        resource :favourites, only: [:create, :destroy]
      end
    end
  end

  namespace :internal do
    resources :campsites, only: [:index, :show]
    namespace :account_settings do
      resource :personal_info, only: [:show, :update]
    end
  end

  namespace :auth do
    delete "/tokens", to: "authentication#logout"
    post "/tokens/register", to: "authentication#register"
    post "/tokens", to: "authentication#login"
    get "/me", to: "authentication#me"
  end

  get "/health_check", to: "health_check#index"
end
