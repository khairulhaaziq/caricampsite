class AddSubmissionStatusToCampsites < ActiveRecord::Migration[7.0]
  def change
    add_column :campsites, :submission_status, :integer
  end
end
