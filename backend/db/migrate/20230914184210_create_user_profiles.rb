class CreateUserProfiles < ActiveRecord::Migration[7.0]
  def change
    create_table :user_profiles do |t|
      t.references :user, null: false, foreign_key: true
      t.string :about
      t.string :name, null: false
      t.string :profile_picture
      t.jsonb :social_links, default: {}

      t.timestamps
    end
  end
end
