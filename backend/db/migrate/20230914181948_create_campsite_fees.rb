class CreateCampsiteFees < ActiveRecord::Migration[7.0]
  def change
    create_table :campsite_fees do |t|
      t.references :campsite, null: false, foreign_key: true
      t.string :currency, null: false, default: 'MYR'
      t.decimal :from, null: false
      t.decimal :to, null: false

      t.timestamps
    end
  end
end
