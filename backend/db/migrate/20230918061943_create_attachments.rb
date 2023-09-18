class CreateAttachments < ActiveRecord::Migration[7.0]
  def change
    create_table :attachments do |t|
      t.string :name
      t.string :attachment_type
      t.bigint :attachable_id
      t.string :attachable_type
      t.text :url

      t.timestamps
    end
  end
end
