class CreateCampsiteAccessibilities < ActiveRecord::Migration[7.0]
  def change
    create_table :campsite_accessibilities do |t|
      t.references :campsite, null: false, foreign_key: true
      t.integer :accessibility_feature, null: false

      t.timestamps
    end
  end
end
