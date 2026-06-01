---
author: Abdul Kareem
pubDatetime: 2026-04-27T11:00:00Z
title: "A guide to installing Grimmory: Your self hosted digital library"
slug: grimmory-install-guide
featured: true
tags:
  - self-host
  - open-source
description: Learn how to host your own digital library using Grimmory.
hideEditPost: true
---

[![DigitalOcean Referral Badge](https://web-platforms.sfo2.cdn.digitaloceanspaces.com/WWW/Badge%203.svg)](https://www.digitalocean.com/?refcode=6609dec273fa&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge)

# Introduction

Grimmory is a self hosted book server that allows you to organize, access and self-host your digital library.

# History

Grimmory is an independent community fork of Booklore. It was an open-source project licensed under the AGPLv3 license but was shut down by the developer. Grimmory exists as the most actively developed fork of Booklore.

See the project here: [Website](https://grimmory.org) | [GitHub](https://github.com/grimmory-tools/grimmory)

# Self Hosting Grimmory
You can self host Grimmory on either your own hardware or you can use a VPS provider like [DigitalOcean](https://m.do.co/c/6609dec273fa) and host it in the cloud. In this blog, I'll be hosting my instance on DigitalOcean.

## Creating the directory structure

First up, we create the directory structure for the application.

```sh
mkdir -p ~/services/grimmory/
sudo mkdir -p /opt/grimmory/{mariadb/config,bookdrop,data,books}
sudo chown -R 1000:1000 /opt/grimmory
```

We do a `chown` with the user id and group id `1000` to ensure no permission issues occur as the grimmory container itself will be running with user and group id `1000`.
If you wish to run it as another user, substitute the user id with the appropriate user id in the `.env` file (here)[hyprlink]

The following defines which folders will be used for what purpose.

| Path | Purpose |
|------|---------|
| `/opt/grimmory/mariadb/config` | Database storage |
| `/opt/grimmory/bookdrop` | Auto Import Folder (see [Bookdrop](https://grimmory.org/docs/bookdrop)) |
| `/opt/grimmory/books` | Your book library |

## Setting up environment variables

```sh
cd ~/services/grimmory
```

Create a `.env` file with the following variables.

```sh showLineNumbers
# Grimmory Application Settings
APP_USER_ID=1000
APP_GROUP_ID=1000
TZ=Etc/UTC
BOOKLORE_PORT=6060

# Database Connection (Grimmory)
DATABASE_URL=jdbc:mariadb://mariadb:3306/grimmory
DB_USER=grimmory
DB_PASSWORD=password

# MariaDB Container Settings
DB_USER_ID=1000
DB_GROUP_ID=1000
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=grimmory
```

Set `TZ` to your timezone.
Change the `DB_PASSWORD` and `MYSQL_ROOT_PASSWORD`. You can generate them using openssl.

```sh
openssl rand -hex 32
```

`DB_PASSWORD` and `MYSQL_ROOT_PASSWORD` should ideally be different.

You can also download the file [here.](https://opengist.abdulkareem.codes/abdulkareemakn/e5302cc014b7433193bcf6f463475a5e/raw/HEAD/grimmory.env)

## Creating the compose file

Now for the compose file, we require two containers. The grimmory application itself and mariadb.

```yaml title="compose.yaml" showLineNumbers
services:
  grimmory:
    image: grimmory/grimmory:latest
    container_name: grimmory
    environment:
      - USER_ID=${APP_USER_ID}
      - GROUP_ID=${APP_GROUP_ID}
      - TZ=${TZ}
      - DATABASE_URL=${DATABASE_URL}
      - DATABASE_USERNAME=${DB_USER}
      - DATABASE_PASSWORD=${DB_PASSWORD}
      - BOOKLORE_PORT=${BOOKLORE_PORT}
    depends_on:
      mariadb:
        condition: service_healthy
    ports:
      - "${BOOKLORE_PORT}:${BOOKLORE_PORT}"
    volumes:
      - /opt/grimmory/data:/app/data
      - /opt/grimmory/books/:/books
      - /opt/grimmory/bookdrop:/bookdrop
    restart: unless-stopped

  mariadb:
    image: lscr.io/linuxserver/mariadb:11.4.5
    container_name: mariadb
    environment:
      - PUID=${DB_USER_ID}
      - PGID=${DB_GROUP_ID}
      - TZ=${TZ}
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
      - MYSQL_DATABASE=${MYSQL_DATABASE}
      - MYSQL_USER=${DB_USER}
      - MYSQL_PASSWORD=${DB_PASSWORD}
    volumes:
      - /opt/grimmory/mariadb/config:/config
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "mariadb-admin", "ping", "-h", "localhost"]
      interval: 5s
      timeout: 5s
      retries: 10
```

You may use the GHCR mirror if you cannot or do not want to use Docker Hub.

```sh
ghcr.io/grimmory-tools/grimmory:latest
```

It's recommended to pin the container to a tagged version when running in production. Check [releases](https://github.com/grimmory-tools/grimmory/releases) to find the tags.

You can also find the file [here.](https://opengist.abdulkareem.codes/abdulkareemakn/9db6766b9ff4409f98f47c93d3cd474a/raw/HEAD/grimmory-compose.yaml)

## Starting the container

You're now ready to run the application. Pull the container image and start it with:

```sh
docker compose up -d
```

Grimmory should now be available at `localhost:6060`

```sh
http://localhost:6060
```

I recommend looking at Grimmory's official documentation [here](https://grimmory.org/docs/getting-started) to continue with the process of setting up the application.

Thanks for reading. Goodbye.
