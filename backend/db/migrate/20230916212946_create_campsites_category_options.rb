class CreateCampsitesCategoryOptions < ActiveRecord::Migration[7.0]
  def change
    create_table :campsites_category_options do |t|
      t.references :campsite, null: false, foreign_key: true
      t.references :category_option, null: false, foreign_key: true

      t.timestamps
    end
  end
end
