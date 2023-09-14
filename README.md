# Caricampsite Monorepo

Endpoints:

base url = '/api/v1'

'/campsites'
GET
  filter_by_state: example '?state=Selangor'
  filter_by_facility: example '?facility=free,waterfall'
  filter_by_fee_from: example '?fee_from=0'
  filter_by_fee_to: example '?fee_to=1000'
POST
  body:
'/campsites/:id'
GET
PUT/PATCH
DELETE

'/reviews'
GET
POST
'/reviews/:id'
GET
PUT/PATCH
DELETE

'/favourites'
GET
POST
'/favourites/:id'
DELETE



