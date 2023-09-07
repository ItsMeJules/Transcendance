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

prod: node_modules
	docker compose -f docker-compose.prod.yml up --build --attach backend --attach frontend --attach bdd

clean: down
	docker system prune -af

fclean : clean
	docker volume ls -q | xargs --no-run-if-empty docker volume rm
	docker volume prune -af

re: fclean all

log :
	docker compose -f docker-compose.yml logs

node_modules:
	cd ./front && npm install
	cd ./back && npm install

.PHONY: all build stop start down clean fclean re log
