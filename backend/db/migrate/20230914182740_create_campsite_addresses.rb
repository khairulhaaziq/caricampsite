class CreateCampsiteAddresses < ActiveRecord::Migration[7.0]
  def change
    create_table :campsite_addresses do |t|
      t.references :campsite, null: false, foreign_key: true
      t.string :addressLine1, null: false
      t.string :addressLine2
      t.string :city, null: false
      t.string :state, null: false
      t.string :country, null: false, default: "Malaysia"
      t.integer :postcode, null: false

      t.timestamps
    end
  end
end
