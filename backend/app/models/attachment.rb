class Attachment < ApplicationRecord
  belongs_to :attachable, polymorphic: true
  before_create :set_name

  def set_name
    parent = attachable
    if attachment_type == "campsite-images"
      self.name = parent.title.parameterize.downcase + "-image-#{SecureRandom.alphanumeric(5).downcase}"
    end
  end
end
