require "test_helper"

class HealthCheckControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get health_check_path
    assert_response :success
  end
end
