class DropUserProfile < ActiveRecord::Migration[7.0]
  def up
    drop_table :user_profiles
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
