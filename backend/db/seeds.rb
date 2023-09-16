# Set doorkeeper oauth default app
if Doorkeeper::Application.count.zero?
  Doorkeeper::Application.create(name: "remix-frontend", redirect_uri: "", scopes: "")
end

# Seed Users
10.times do
  User.create(
    email: Faker::Internet.unique.email,
    password: Faker::Internet.password,
    role: [0, 1].sample # Assuming 0 is for regular users and 1 is for admins
  )
end

# Seed Features
5.times do
  Feature.create(
    name: Faker::Lorem.word
  )
end

# Seed Campsites
20.times do
  campsite = Campsite.create(
    name: Faker::Lorem.words(number: 3).join(" "),
    description: Faker::Lorem.paragraph,
    direction_instructions: Faker::Lorem.sentence,
    things_to_know: Faker::Lorem.sentence,
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
  rand(1..3).times do
    CampsitesFeature.create(
      campsite: campsite,
      feature: Feature.all.sample
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
