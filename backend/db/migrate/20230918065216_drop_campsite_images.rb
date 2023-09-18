class DropCampsiteImages < ActiveRecord::Migration[7.0]
  def up
    # This migration is for dropping the table, so no need to define "up" method
  end

  def down
    drop_table :campsite_images
  end
end
