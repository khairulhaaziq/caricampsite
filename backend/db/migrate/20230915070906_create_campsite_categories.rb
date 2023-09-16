class CreateCampsiteCategories < ActiveRecord::Migration[7.0]
  def change
    create_table :campsite_categories do |t|
      t.references :campsite, null: false, foreign_key: true
      t.integer :category, null: false

      t.timestamps
    end
  end
end
