class AddDeletedAtToCampsites < ActiveRecord::Migration[7.0]
  def change
    add_column :campsites, :deleted_at, :datetime
    add_index :campsites, :deleted_at
  end
end
