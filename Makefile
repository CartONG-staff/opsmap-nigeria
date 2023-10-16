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

## —— Utils 🪄 ————————————————————————————————————————————————————————————————
run-local-dataset-server: ## To plug on a local opsmap-datasets repository
	$(info )
	$(info =================================================================)
	$(info )
	$(info Make sure to set the following variable in your .env.local :)
	$(info )
	$(info VUE_APP_GENERAL_CONFIG_DIRECTORY=http://127.0.0.1:9090/brazil/)
	$(info )
	$(info Then you can run "yarn serve" command)
	$(info )
	$(info =================================================================)
	$(info )
	$(info )
	npx http-server ../opsmap-datasets -p 9090 --cors


