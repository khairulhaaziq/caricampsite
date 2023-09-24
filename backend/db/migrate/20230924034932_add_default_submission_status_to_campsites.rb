class AddDefaultSubmissionStatusToCampsites < ActiveRecord::Migration[7.0]
  def change
    change_column :campsites, :submission_status, :integer, default: 0
  end
end
