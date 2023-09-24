class AddSubmissionTypeToCampsite < ActiveRecord::Migration[7.0]
  def change
    add_column :campsite, :submission_type, :integer
  end
end
