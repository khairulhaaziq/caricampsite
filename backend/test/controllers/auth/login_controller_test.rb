require "test_helper"

class Auth::LoginControllerTest < ActionDispatch::IntegrationTest
  test "should get create" do
    get auth_login_create_url
    assert_response :success
  end
end
