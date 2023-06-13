# Executables (local)
DOCKER_COMP = docker-compose

## —— Docker 🐳 ————————————————————————————————————————————————————————————————
build: ## Builds the Docker images
	@$(DOCKER_COMP) build --pull --no-cache

build-cached: ## Builds the Docker images
	@$(DOCKER_COMP) build --pull

up: ## Start the docker hub in detached mode (no logs)
	@$(DOCKER_COMP) up --detach

start: build-dev up ## Build and start the containers

down: ## Stop the docker hub
	@$(DOCKER_COMP) down --remove-orphans

restart: down up

down-remove-all: ## Stop and remove the docker hub
	@$(DOCKER_COMP) down --remove-orphans --rmi all -v

dev-remove:
	@$(DOCKER_COMP) rm -fvs

