class CreateCampsitesAdmins < ActiveRecord::Migration[7.0]
  def change
    create_table :campsites_admins do |t|
      t.references :campsite, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
