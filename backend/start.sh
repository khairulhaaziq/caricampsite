#!/bin/bash

# Starts Sidekiq worker or Rails server based on PROCESS_TYPE env var

if [[ -z "${PROCESS_TYPE}" ]]; then
  echo "Process type is not set"
  exit 1
else
  PROCESS_TYPE="${PROCESS_TYPE}"
  echo "Starting process ${PROCESS_TYPE} ${RAILS_ENV}"
fi

if [[ "$PROCESS_TYPE" == "worker" ]]; then
  echo "Starting worker process"
  bundle exec sidekiq -e ${RAILS_ENV} -C ${PWD}/config/sidekiq.yml
elif [[ "$PROCESS_TYPE" == "backend" ]] || [[ "$PROCESS_TYPE" == "web" ]]; then
  echo "Starting backend process"
  rm -f tmp/pids/server.pid && (bundle exec rake db:create || echo "Database already exists") && bundle exec rake db:migrate && bundle exec rake db:seed && bundle exec rails s -p 3000 -b '0.0.0.0'
else
  echo "Invalid process type ${PROCESS_TYPE}"
  exit 1
fi
