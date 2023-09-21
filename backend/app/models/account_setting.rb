class AccountSetting < ApplicationRecord
  belongs_to :user
  has_one :personal_info
end
