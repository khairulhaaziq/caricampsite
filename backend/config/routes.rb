Rails.application.routes.draw do
  use_doorkeeper do
    skip_controllers :authorizations, :applications, :authorized_applications
  end

  namespace :api do
    namespace :v1 do
      resources :campsites
    end
  end

  delete '/auth/logout', to: 'authentication#logout'
  post '/auth/register', to: 'authentication#register'
  post '/auth/login', to: 'authentication#login'
  get '/auth/me', to: 'authentication#me'
  get '/health_check', to: 'health_check#index'
end
