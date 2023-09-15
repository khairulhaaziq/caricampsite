# syntax=docker/dockerfile:1
FROM ruby:3.2.2-bullseye
RUN apt-get update -qq && apt-get install -y postgresql-client libjemalloc2 && rm -rf /var/lib/apt/lists/*
WORKDIR /myapp
COPY Gemfile /myapp/Gemfile
COPY Gemfile.lock /myapp/Gemfile.lock
RUN bundle update --bundler
RUN bundle install

# Add a script to be executed every time the container starts.
COPY ./entrypoint.sh /usr/bin/entrypoint.sh
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

EXPOSE 3000

# Configure the main process to run when running the image
COPY . /myapp/
CMD ["./start.sh"]
