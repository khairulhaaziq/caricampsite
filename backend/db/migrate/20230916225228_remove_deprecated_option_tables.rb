class RemoveDeprecatedOptionTables < ActiveRecord::Migration[7.0]
  def change
    drop_table :campsite_accessibilities
    drop_table :campsite_activities
    drop_table :campsite_amenities
    drop_table :campsite_categories
    drop_table :campsites_features
    drop_table :features
  end
end
