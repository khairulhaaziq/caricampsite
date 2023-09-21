class PersonalInfo < ApplicationRecord
  belongs_to :account_setting
  has_one :address, as: :addressable
end
