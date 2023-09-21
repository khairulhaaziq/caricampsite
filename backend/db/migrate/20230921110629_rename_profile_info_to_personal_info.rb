class RenameProfileInfoToPersonalInfo < ActiveRecord::Migration[7.0]
  def change
    rename_table :profile_infos, :personal_infos
  end
end
