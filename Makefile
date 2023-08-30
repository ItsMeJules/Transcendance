all: node_modules build

build:
	docker compose -f docker-compose.yml up --build --attach backend --attach frontend --attach bdd

stop:
	docker compose -f docker-compose.yml stop

start:
	docker compose -f docker-compose.yml start

restart:
	docker compose -f docker-compose.yml restart

down:
	docker compose -f docker-compose.yml down

prod:
	docker compose -f docker-compose.prod.yml up --build --attach backend --attach frontend --attach bdd

clean: down
	docker system prune -af

fclean : clean
	docker volume ls -q | xargs --no-run-if-empty docker volume rm
	docker volume prune -f

re: fclean all

log :
	docker compose -f docker-compose.yml logs

node_modules:
	@if [ ! -d "./front/node_modules" ]; then \
		cd ./front && npm install; \
	fi
	@if [ ! -d "./back/node_modules" ]; then \
		cd ./back && npm install; \
	fi

.PHONY: all build stop start down clean fclean re log
