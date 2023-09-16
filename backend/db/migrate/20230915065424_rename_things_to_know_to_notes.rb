class RenameThingsToKnowToNotes < ActiveRecord::Migration[7.0]
  def change
    rename_column :campsites, :things_to_know, :notes
  end
end
