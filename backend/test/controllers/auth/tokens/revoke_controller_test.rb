require "test_helper"

class Auth::Tokens::RevokeControllerTest < ActionDispatch::IntegrationTest
  test "should get destroy" do
    get auth_tokens_revoke_destroy_url
    assert_response :success
  end
end
