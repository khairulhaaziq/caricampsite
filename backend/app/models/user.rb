class User < ApplicationRecord
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  validates :email, format: URI::MailTo::EMAIL_REGEXP
  has_many :visits
  has_many :reviews
  has_many :favourites
  has_many :campsite_admins
  has_many :administered_campsites, through: :campsite_admins, source: :campsite
  has_one :user_profiles
  enum :role, [ :master, :member ]

  def self.authenticate(email, password)
    user = User.find_for_authentication(email: email)
    user&.valid_password?(password) ? user : nil
  end
end
