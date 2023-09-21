class ProfileInfo < ApplicationRecord
  belongs_to :account_setting
  has_one :address, as: :addressable
end
