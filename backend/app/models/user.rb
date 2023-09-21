class User < ApplicationRecord
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
    :recoverable, :rememberable, :validatable

  enum :role, [:master, :member]

  has_many :visits
  has_many :reviews
  has_many :favourites
  has_many :campsites_admins
  has_many :administered_campsites, through: :campsites_admins, source: :campsite

  has_one :account_setting
  has_one :personal_info, through: :account_setting

  validates :email, format: URI::MailTo::EMAIL_REGEXP

  def self.authenticate(email, password)
    user = User.find_for_authentication(email: email)
    user&.valid_password?(password) ? user : nil
  end
end
