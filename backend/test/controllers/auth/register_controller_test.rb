require "test_helper"

class Auth::RegisterControllerTest < ActionDispatch::IntegrationTest
  test "should get create" do
    get auth_register_create_url
    assert_response :success
  end
end
