# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2023_09_14_235918) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "campsite_addresses", force: :cascade do |t|
    t.bigint "campsite_id", null: false
    t.string "addressLine1", null: false
    t.string "addressLine2"
    t.string "city", null: false
    t.string "state", null: false
    t.string "country", default: "Malaysia", null: false
    t.integer "postcode", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["campsite_id"], name: "index_campsite_addresses_on_campsite_id"
  end

  create_table "campsite_fees", force: :cascade do |t|
    t.bigint "campsite_id", null: false
    t.string "currency", default: "MYR", null: false
    t.decimal "from", null: false
    t.decimal "to", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["campsite_id"], name: "index_campsite_fees_on_campsite_id"
  end

  create_table "campsite_locations", force: :cascade do |t|
    t.bigint "campsite_id", null: false
    t.decimal "latitude", null: false
    t.decimal "longitude", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["campsite_id"], name: "index_campsite_locations_on_campsite_id"
  end

  create_table "campsites", force: :cascade do |t|
    t.string "name", null: false
    t.text "description", null: false
    t.text "direction_instructions"
    t.text "things_to_know"
    t.string "slug", null: false
    t.string "images", default: [], array: true
    t.string "cover_image"
    t.integer "status"
    t.boolean "is_verified", default: false
    t.jsonb "social_links", default: {}
    t.jsonb "contacts", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["deleted_at"], name: "index_campsites_on_deleted_at"
    t.index ["slug"], name: "index_campsites_on_slug", unique: true
  end

  create_table "campsites_admins", force: :cascade do |t|
    t.bigint "campsite_id", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["campsite_id"], name: "index_campsites_admins_on_campsite_id"
    t.index ["user_id"], name: "index_campsites_admins_on_user_id"
  end

  create_table "campsites_features", force: :cascade do |t|
    t.bigint "campsite_id", null: false
    t.bigint "feature_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["campsite_id"], name: "index_campsites_features_on_campsite_id"
    t.index ["feature_id"], name: "index_campsites_features_on_feature_id"
  end

  create_table "favourites", force: :cascade do |t|
    t.bigint "campsite_id", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["campsite_id"], name: "index_favourites_on_campsite_id"
    t.index ["user_id"], name: "index_favourites_on_user_id"
  end

  create_table "features", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "oauth_access_tokens", force: :cascade do |t|
    t.bigint "resource_owner_id"
    t.bigint "application_id", null: false
    t.string "token", null: false
    t.string "refresh_token"
    t.integer "expires_in"
    t.datetime "revoked_at", precision: nil
    t.datetime "created_at", precision: nil, null: false
    t.string "scopes"
    t.string "previous_refresh_token", default: "", null: false
    t.index ["application_id"], name: "index_oauth_access_tokens_on_application_id"
    t.index ["refresh_token"], name: "index_oauth_access_tokens_on_refresh_token", unique: true
    t.index ["resource_owner_id"], name: "index_oauth_access_tokens_on_resource_owner_id"
    t.index ["token"], name: "index_oauth_access_tokens_on_token", unique: true
  end

  create_table "oauth_applications", force: :cascade do |t|
    t.string "name", null: false
    t.string "uid", null: false
    t.string "secret", null: false
    t.text "redirect_uri"
    t.string "scopes", default: "", null: false
    t.boolean "confidential", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["uid"], name: "index_oauth_applications_on_uid", unique: true
  end

  create_table "reviews", force: :cascade do |t|
    t.bigint "campsite_id", null: false
    t.bigint "user_id", null: false
    t.text "body", null: false
    t.string "images", default: [], array: true
    t.integer "rating", default: 1, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["campsite_id"], name: "index_reviews_on_campsite_id"
    t.index ["user_id"], name: "index_reviews_on_user_id"
  end

  create_table "user_profiles", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "about"
    t.string "name", null: false
    t.string "profile_picture"
    t.jsonb "social_links", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_user_profiles_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "role"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "visits", force: :cascade do |t|
    t.bigint "campsite_id", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["campsite_id"], name: "index_visits_on_campsite_id"
    t.index ["user_id"], name: "index_visits_on_user_id"
  end

  add_foreign_key "campsite_addresses", "campsites"
  add_foreign_key "campsite_fees", "campsites"
  add_foreign_key "campsite_locations", "campsites"
  add_foreign_key "campsites_admins", "campsites"
  add_foreign_key "campsites_admins", "users"
  add_foreign_key "campsites_features", "campsites"
  add_foreign_key "campsites_features", "features"
  add_foreign_key "favourites", "campsites"
  add_foreign_key "favourites", "users"
  add_foreign_key "oauth_access_tokens", "oauth_applications", column: "application_id"
  add_foreign_key "reviews", "campsites"
  add_foreign_key "reviews", "users"
  add_foreign_key "user_profiles", "users"
  add_foreign_key "visits", "campsites"
  add_foreign_key "visits", "users"
end
