class CreateFeatureOptions < ActiveRecord::Migration[7.0]
  def change
    create_table :feature_options do |t|
      t.string :name, null: false

      t.timestamps
    end
    add_index :feature_options, :name, unique: true
  end
end
