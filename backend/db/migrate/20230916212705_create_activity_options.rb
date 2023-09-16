class CreateActivityOptions < ActiveRecord::Migration[7.0]
  def change
    create_table :activity_options do |t|
      t.string :name

      t.timestamps
    end
  end
end
