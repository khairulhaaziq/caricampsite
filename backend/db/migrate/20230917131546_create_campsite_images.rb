class CreateCampsiteImages < ActiveRecord::Migration[7.0]
  def change
    create_table :campsite_images do |t|
      t.references :campsite, null: false, foreign_key: true
      t.string :image_url, null: false

      t.timestamps
    end
  end
end
