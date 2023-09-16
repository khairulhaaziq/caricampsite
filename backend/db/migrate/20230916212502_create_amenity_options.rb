class CreateAmenityOptions < ActiveRecord::Migration[7.0]
  def change
    create_table :amenity_options do |t|
      t.string :name, null: false

      t.timestamps
    end
    add_index :amenity_options, :name, unique: true
  end
end
