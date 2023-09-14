class AuthenticationController < ApplicationController
  before_action :doorkeeper_authorize!, :set_current_user, except: [:register, :login]

  def me
    user = render_serializer(UserSerializer, @current_user)
    render json: user, status: user[:code] || 200
  end

  def logout
    client_app = Doorkeeper::Application.find_by(name: 'remix-frontend')

    Doorkeeper::AccessToken.revoke_all_for(client_app.id , @current_user)

    render json: { response: 'ok', message: 'Successfully revoked user\'s token(s).' }, status: 200
  end

  def register
    user = User.new(email: user_params[:email], password: user_params[:password])
    client_app = Doorkeeper::Application.find_by(name: 'remix-frontend')

    return render(json: { error: 'Invalid client ID'}, status: 403) unless client_app

    if user.save
      access_token = generate_access_token(user, client_app)
      render(json: {
        user: {
          id: user.id,
          email: user.email,
          access_token: access_token.token,
          token_type: 'bearer',
          expires_in: access_token.expires_in,
          refresh_token: access_token.refresh_token,
          created_at: access_token.created_at.to_time.to_i
        }
      })
    else
      render(json: { error: user.errors.full_messages }, status: 422)
    end
  end

  def login
    user = User.authenticate(params[:email], params[:password])

    if user
      client_app = Doorkeeper::Application.find_by(name: 'remix-frontend')
      access_token = generate_access_token(user, client_app)
      render(json: {
        user: {
          id: user.id,
          email: user.email,
          access_token: access_token.token,
          token_type: 'bearer',
          expires_in: access_token.expires_in,
          refresh_token: access_token.refresh_token,
          created_at: access_token.created_at.to_time.to_i
        }
      })
    else
      render json: error_json(401), status: 401
    end
  end

  private

  def user_params
    params.permit(:email, :password)
  end

  def generate_refresh_token
    loop do
      # generate a random token string and return it,
      # unless there is already another token with the same string
      token = SecureRandom.hex(32)
      break token unless Doorkeeper::AccessToken.exists?(refresh_token: token)
    end
  end

  def generate_access_token(user, client_app)
    Doorkeeper::AccessToken.create(
      resource_owner_id: user.id,
      application_id: client_app.id,
      refresh_token: generate_refresh_token,
      expires_in: Doorkeeper.configuration.access_token_expires_in.to_i,
      scopes: ''
    )
  end
end
