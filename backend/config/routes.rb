Rails.application.routes.draw do
  resources :visits
  use_doorkeeper do
    skip_controllers :authorizations, :applications, :authorized_applications
  end

  namespace :api do
    namespace :v1 do
      resources :campsites, except: :show do
        resource :reviews, only: [:create, :update, :destroy]
        resource :visits, only: [:create, :destroy]
      end
      get "campsites/:slug", to: "campsites#show"
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
