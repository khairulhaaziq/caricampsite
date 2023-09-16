require "test_helper"

class Api::V1::CampsitesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @api_v1_campsite = api_v1_campsites(:one)
  end

  test "should get index" do
    get api_v1_campsites_url, as: :json
    assert_response :success
  end

  test "should create api_v1_campsite" do
    assert_difference("Api::V1::Campsite.count") do
      post api_v1_campsites_url, params: {api_v1_campsite: {}}, as: :json
    end

    assert_response :created
  end

  test "should show api_v1_campsite" do
    get api_v1_campsite_url(@api_v1_campsite), as: :json
    assert_response :success
  end

  test "should update api_v1_campsite" do
    patch api_v1_campsite_url(@api_v1_campsite), params: {api_v1_campsite: {}}, as: :json
    assert_response :success
  end

  test "should destroy api_v1_campsite" do
    assert_difference("Api::V1::Campsite.count", -1) do
      delete api_v1_campsite_url(@api_v1_campsite), as: :json
    end

    assert_response :no_content
  end
end
