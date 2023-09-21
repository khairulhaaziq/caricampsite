class CreateAddresses < ActiveRecord::Migration[7.0]
  def change
    create_table :addresses do |t|
      t.references :addressable, polymorphic: true, null: false
      t.string :street
      t.string :street2
      t.string :city
      t.string :state
      t.string :country
      t.string :postcode

      t.timestamps
    end
  end
end
