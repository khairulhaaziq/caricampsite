class AccountSetting < ApplicationRecord
  belongs_to :user
  has_one :profile_info
end
