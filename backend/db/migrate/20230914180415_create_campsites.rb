class CreateCampsites < ActiveRecord::Migration[7.0]
  def change
    create_table :campsites do |t|
      t.string :name, null: false
      t.text :description, null: false
      t.text :direction_instructions
      t.text :things_to_know
      t.string :slug, null: false
      t.string :images, array: true, default: []
      t.string :cover_image
      t.integer :status
      t.boolean :is_verified, default: false
      t.jsonb :social_links, default: {}
      t.jsonb :contacts, default: {}

      t.timestamps
    end
    add_index :campsites, :slug, unique: true
  end
end
