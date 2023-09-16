class CreateCampsiteAmenities < ActiveRecord::Migration[7.0]
  def change
    create_table :campsite_amenities do |t|
      t.references :campsite, null: false, foreign_key: true
      t.integer :amenity, null: false

      t.timestamps
    end
  end
end
