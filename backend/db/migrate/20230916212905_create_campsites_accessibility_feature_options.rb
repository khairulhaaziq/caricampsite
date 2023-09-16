class CreateCampsitesAccessibilityFeatureOptions < ActiveRecord::Migration[7.0]
  def change
    create_table :campsites_accessibility_feature_options do |t|
      t.references :campsite, null: false, foreign_key: true
      t.references :accessibility_feature_option, foreign_key: true, index: {name: "index_campsites_accessibility_options_on_option_id"}

      t.timestamps
    end
  end
end
