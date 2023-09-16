class CreateAccessibilityFeatureOptions < ActiveRecord::Migration[7.0]
  def change
    create_table :accessibility_feature_options do |t|
      t.string :name

      t.timestamps
    end
  end
end
