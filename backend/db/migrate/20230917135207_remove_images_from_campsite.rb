class RemoveImagesFromCampsite < ActiveRecord::Migration[7.0]
  def change
    remove_column :campsites, :images
  end
end
