class CreateCampsiteActivities < ActiveRecord::Migration[7.0]
  def change
    create_table :campsite_activities do |t|
      t.references :campsite, null: false, foreign_key: true
      t.integer :activity, null: false

      t.timestamps
    end
  end
end
