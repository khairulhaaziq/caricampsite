class CampsitesCategoryOption < ApplicationRecord
  belongs_to :campsite
  belongs_to :category_option
end
