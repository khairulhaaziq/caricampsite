class CreateProfileInfos < ActiveRecord::Migration[7.0]
  def change
    create_table :profile_infos do |t|
      t.references :account_setting, null: false, foreign_key: true
      t.string :first_name
      t.string :last_name
      t.string :email
      t.string :phone_number

      t.timestamps
    end
  end
end
