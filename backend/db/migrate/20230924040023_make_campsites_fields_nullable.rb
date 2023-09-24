class MakeCampsitesFieldsNullable < ActiveRecord::Migration[7.0]
  def change
    change_column :campsites, :title, :string, null: true
    change_column :campsites, :description, :text, null: true
    change_column :campsites, :slug, :string, null: true
  end
end
