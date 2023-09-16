class CreateActivityOptions < ActiveRecord::Migration[7.0]
  def change
    create_table :activity_options do |t|
      t.string :name

      t.timestamps
    end
    add_index :activity_options, :name, unique: true
  end
end
