class RenameNameToTitleInCampsites < ActiveRecord::Migration[7.0]
  def change
    rename_column :campsites, :name, :title
  end
end
