# Set doorkeeper oauth default app
if Doorkeeper::Application.count.zero?
  Doorkeeper::Application.create(name: "remix-frontend", redirect_uri: "", scopes: "")
end

# Seed Example User
User.create(
  email: "test@example.com",
  password: "Password123",
  role: [0, 1].sample # Assuming 0 is for regular users and 1 is for admins
)

# Seed Users
10.times do
  User.create(
    email: Faker::Internet.unique.email,
    password: Faker::Internet.password,
    role: [0, 1].sample # Assuming 0 is for regular users and 1 is for admins
  )
end

# Seed Features
[
  "tent_camping",
  "rv_camping",
  "cabin_rentals",
  "glamping",
  "group_camping",
  "beach_camping",
  "mountain_camping",
  "lakefront_camping",
  "forest_camping",
  "desert_camping",
  "backcountry_camping",
  "family_friendly",
  "pet_friendly",
  "boondocking",
  "fishing_camping",
  "hunting_camping",
  "winter_camping",
  "eco_friendly",
  "romantic_getaway",
  "adventure_camping",
  "off_roading_camping",
  "solo_camping",
  "luxury_camping",
  "historical_camping",
  "farm_camping"
].each do |x|
  FeatureOption.find_or_create_by(name: x)
end

[
  "swimming_pool",
  "wifi",
  "restaurant",
  "playground",
  "shower_facility",
  "toilet_facility",
  "picnic_area",
  "campfire_area",
  "hiking_trails",
  "fishing",
  "cycling",
  "boating",
  "wildlife_viewing",
  "pet_friendly",
  "rv_hookups",
  "electricity_hookups",
  "laundry_facility",
  "camp_store",
  "showers",
  "restrooms",
  "dump_station",
  "picnic_tables",
  "fire_pits",
  "barbecue_grills",
  "drinking_water"
].each do |x|
  AmenityOption.find_or_create_by(name: x)
end

[
  "hiking",
  "biking",
  "fishing",
  "boating",
  "bird_watching",
  "canoeing",
  "kayaking",
  "swimming",
  "wildlife_viewing",
  "stargazing",
  "photography",
  "rock_climbing",
  "horseback_riding",
  "picnicking",
  "geocaching",
  "hunting",
  "campfire",
  "archery",
  "nature_programs",
  "orienteering",
  "backpacking",
  "caving",
  "cross_country_skiing",
  "snowshoeing",
  "snowmobiling",
  "off_roading",
  "ice_fishing",
  "sled_dog_mushing",
  "water_skiing",
  "wind_surfing",
  "tubing"
].each do |x|
  ActivityOption.find_or_create_by(name: x)
end

[
  "tent_camping",
  "rv_camping",
  "cabin_rentals",
  "glamping",
  "group_camping",
  "beach_camping",
  "mountain_camping",
  "lakefront_camping",
  "forest_camping",
  "desert_camping",
  "backcountry_camping",
  "family_friendly",
  "pet_friendly",
  "boondocking",
  "fishing_camping",
  "hunting_camping",
  "winter_camping",
  "eco_friendly",
  "romantic_getaway",
  "adventure_camping",
  "off_roading_camping",
  "solo_camping",
  "luxury_camping",
  "historical_camping",
  "farm_camping"
].each do |x|
  CategoryOption.find_or_create_by(name: x)
end

[
  "wheelchair_accessible",
  "pet_friendly",
  "hiking_trails"
].each do |x|
  AccessibilityFeatureOption.find_or_create_by(name: x)
end

# Seed Campsites
20.times do
  campsite = Campsite.create(
    name: Faker::Lorem.words(number: 3).join(" "),
    description: Faker::Lorem.paragraph,
    direction_instructions: Faker::Lorem.sentence,
    notes: Faker::Lorem.sentence,
    images: 5.times.map { Faker::LoremFlickr.image },
    cover_image: Faker::LoremFlickr.image,
    status: [0, 1].sample, # Assuming 0 is for inactive and 1 is for active
    is_verified: [true, false].sample,
    social_links: {
      facebook: Faker::Internet.url(host: "facebook.com"),
      twitter: Faker::Internet.url(host: "twitter.com")
    },
    contacts: {
      name: Faker::Name.name,
      phone: Faker::PhoneNumber.phone_number
    }
  )

  # Seed Campsite Addresses
  CampsiteAddress.create(
    campsite: campsite,
    addressLine1: Faker::Address.street_address,
    addressLine2: Faker::Address.secondary_address,
    city: Faker::Address.city,
    state: Faker::Address.state,
    country: "Malaysia",
    postcode: Faker::Address.zip_code
  )

  # Seed Campsite Fees
  CampsiteFee.create(
    campsite: campsite,
    currency: "MYR",
    from: Faker::Number.decimal(l_digits: 2),
    to: Faker::Number.decimal(l_digits: 2)
  )

  # Seed Campsite Locations
  CampsiteLocation.create(
    campsite: campsite,
    latitude: Faker::Address.latitude,
    longitude: Faker::Address.longitude
  )

  # Seed Campsite Admins (Assuming each campsite has one admin)
  CampsitesAdmin.create(
    campsite: campsite,
    user: User.all.sample
  )

  # Seed Campsite Features (Assign random features to the campsite)
  rand(1..5).times do
    CampsitesFeatureOption.create(
      campsite: campsite,
      feature_option: FeatureOption.all.sample
    )
  end

  rand(1..10).times do
    CampsitesAmenityOption.create(
      campsite: campsite,
      amenity_option: AmenityOption.all.sample
    )
  end

  rand(1..9).times do
    CampsitesActivityOption.create(
      campsite: campsite,
      activity_option: ActivityOption.all.sample
    )
  end

  rand(1..3).times do
    CampsitesCategoryOption.create(
      campsite: campsite,
      category_option: CategoryOption.all.sample
    )
  end

  rand(1..2).times do
    CampsitesAccessibilityFeatureOption.create(
      campsite: campsite,
      accessibility_feature_option: AccessibilityFeatureOption.all.sample
    )
  end

  # Seed Reviews (Assuming each campsite has at least one review)
  rand(1..5).times do
    Review.create(
      campsite: campsite,
      user: User.all.sample,
      body: Faker::Lorem.paragraph,
      images: 3.times.map { Faker::LoremFlickr.image },
      rating: rand(1..5)
    )
  end
end

# Seed User Profiles (Assuming each user has a profile)
User.all.each do |user|
  UserProfile.create(
    user: user,
    about: Faker::Lorem.sentence,
    name: user.email.split("@").first.capitalize,
    profile_picture: Faker::Avatar.image,
    social_links: {
      facebook: Faker::Internet.url(host: "facebook.com"),
      twitter: Faker::Internet.url(host: "twitter.com")
    }
  )
end

# Seed Favourites (Assuming users can have favorites)
User.all.each do |user|
  rand(1..5).times do
    Favourite.create(
      campsite: Campsite.all.sample,
      user: user
    )
  end
end

# Seed Visits (Assuming users can have visits)
User.all.each do |user|
  rand(1..5).times do
    Visit.create(
      campsite: Campsite.all.sample,
      user: user
    )
  end
end
