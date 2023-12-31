class CreateCampsiteLocations < ActiveRecord::Migration[7.0]
  def change
    create_table :campsite_locations do |t|
      t.references :campsite, null: false, foreign_key: true
      t.decimal :latitude, null: false
      t.decimal :longitude, null: false

      t.timestamps
    end
  end
end
