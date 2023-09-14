class CreateReviews < ActiveRecord::Migration[7.0]
  def change
    create_table :reviews do |t|
      t.references :campsite, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.text :body, null: false
      t.string :images, array: true, default: []
      t.integer :rating, null: false, default: 1

      t.timestamps
    end
  end
end
