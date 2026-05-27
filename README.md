# Marketplace: Core Service

The **core** service of [Marketplace](https://coderepo.corp.tander.ru/it_khd/dev_khd/data-catalog-marketplace), 
provides API for the UI.


<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Navigation

- [Installing](#installing)
- [Running](#running)
  - [Development](#development)
    - [IDE support](#ide-support)
    - [Generate test data](#generate-test-data)
    - [DB Migrations](#db-migrations)
  - [Production](#production)
- [Testing](#testing)
- [Git Workflow](#git-workflow)
- [Project concept and code style](#project-concept-and-code-style)
  - [Markdown TOC](#markdown-toc)
  - [Package Manager](#package-manager)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Installing

1. Install `Marketplace` project. For details, refer to the [Marketplace README.md](../../README.md#installing)

2. Make sure you are in the [services](../../services) folder.

3. Clone this service:

   ```shell
   git clone git@coderepo.corp.tander.ru:magnit-data/marketplace/marketplace_core.git core
   ```


## Running


### Development

1. Copy the required environment variable files for this service 
   (see `services:core` in [docker-compose.yml](../../devops/docker/dev/docker-compose.yml)) 
   from [../../devops/docker/dev/_samples](../../devops/docker/dev/_samples) 
   to [../../devops/docker/dev](../../devops/docker/dev) and set the appropriate values.

2. Run service:

   ```shell
   docker compose -f ../../devops/docker/dev/docker-compose.yml up --build -d core
   ```

3. Run migrations:

   ```shell
   docker compose -f ../../devops/docker/dev/docker-compose.yml up --build -d deploy_migrations
   ```


#### IDE support

To enable correct path resolution, code navigation, and autocompletion in your IDE, run:

```shell
pnpm i
```

```shell
pnpm run prisma:generate_client:axon && pnpm run prisma:generate_client:marketplace
```

> These host-side folders won’t overwrite the ones inside the container, 
> because Docker volumes map only the source code directories.


#### Generate test data

```shell
docker exec -it marketplace__core__dev pnpm run prisma:generate_db -- --reset --count 100
```

> **count** is count of datasets


#### DB Migrations

Whenever you change the database schema, you need:

1. Create migrations:
    
    ```shell
    docker exec -it marketplace__core__dev pnpm prisma migrate dev --name <some_name>
    ```

2. Generate prisma client:
    
    ```shell
    docker exec -it marketplace__core__dev pnpm run prisma:generate_client:axon &&
    docker exec -it marketplace__core__dev pnpm run prisma:generate_client:marketplace
    ```


### Production

1. Copy the required environment variable files for this service 
   (see `services:core` in [docker-compose.yml](../../devops/docker/prod/docker-compose.yml)) 
   from [../../devops/docker/prod/_samples](../../devops/docker/prod/_samples) 
   to [../../devops/docker/prod](../../devops/docker/prod) and set the appropriate values.

2. Run service:

   ```shell
   docker compose -f ../../devops/docker/prod/docker-compose.yml up core --build -d
   ```

3. (optional) Applying migrations. Since the production database is shared, **migrations are not executed automatically**. 
    If you have added new migrations, **carefully review their impact on the schema and data**, create a backup (recommended), 
    and only then apply them manually:

   ```shell
   docker compose -f ../../devops/docker/prod/docker-compose.yml up --build -d deploy_migrations
   ```


## Testing

Run:

```shell
pnpm run test
```


## Git Workflow

The Git workflow is the same as in the main `Marketplace` repository.  
See the [Marketplace README.md](../../README.md#git-workflow) for details.


## Project concept and code style

Project concept and code style is the same as in the main `Marketplace` repository.  
See the [tg_notifier README.md](../../README.md#project-concept-and-code-style) for details.


### Markdown TOC

To automatically update Markdown table of contents (TOC), run:

```shell
doctoc --title "## Navigation" --maxlevel 4 README.md
```

### Package Manager

We use **pnpm** as the primary package manager.  
If you use a different package manager (e.g., due to environment restrictions), 
make sure its lock file is **excluded from git commits**.


## Contributing

To report bugs or suggest improvements, please use the 
[issue tracker](https://coderepo.corp.tander.ru/it_khd/dev_khd/marketplace-core/-/issues)

If you discover a security issue in the code, do **not** create an issue or raise it in any public forum 
until we have had a chance to address it. **For security issues, contact**: maltcev_a_v@magnit.ru


## Licence

Copyright © 2025 Magnit Tech
