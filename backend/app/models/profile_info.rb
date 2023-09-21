class ProfileInfo < ApplicationRecord
  belongs_to :account_settings
  has_one :address, as: :addressable
end
