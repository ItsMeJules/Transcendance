prod:
			docker compose -f docker-compose.prod.yml up --build --attach backend --attach frontend --attach bdd

dev:
			docker compose up --attach backend --attach frontend --attach bdd

dev-build:
			docker compose up --build --attach backend --attach frontend --attach bdd

prune:
			docker system prune -af

volume:
			docker volume ls -q | xargs --no-run-if-empty docker volume rm

prune-all:	prune volume
			clear
			@echo "All cleared"

.PHONY: prod dev dev-build prune volume prune-all