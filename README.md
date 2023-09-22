# Caricampsite Monorepo

## Development

### Starting your local dev environment

### With Docker
This is the easiest way to set up. You need to have docker installed. Just run at root file:

```sh
make start
```

Done! Now your rails server is running at port `3000` and your remix server is running at port `3100`.
To test it visit these urls:
- `http://localhost:3000` should return rails default homepage.
- `http://localhost:3100` should return the cari campsite feed page.


### Without Docker

TODO

### Seeding database

Working with empty databases isn't fun.
If you went to `http://localhost:3100` you probably dont see any listings, that is because there arent any listings!
To seed your database and have a working example, just run:

> **Note**
> You need to run this in the docker container terminal if you used docker.

1. Go to your backend root directory: `/backend`

```sh
cd backend
```

2. Run seed command
```sh
bundle exec rails db:seed
```

## License
MIT License.


