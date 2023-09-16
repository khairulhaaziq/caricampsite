start:
	docker-compose -f docker-compose.development.yml up --build

start-local:
# start db
	brew services start postgresql@15
# start backend
	cd backend && rails s

# on another terminal, start frontend
start-local-frontend:
# start frontend
	cd frontend && bun i && bun run dev
