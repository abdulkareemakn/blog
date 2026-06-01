---
title: "Jellyfin: The Free and Open Source alternative to Plex"
description: Jellyfin, a free and open source media server that lets you stream your media from your own server to any device.
pubDatetime: 2026-05-24T14:00:00Z
author: Abdul Kareem
slug: jellyfin-install-guide
featured: true
hideEditPost: true
tags:
  - open source
  - jellyfin
  - docker
---

[![DigitalOcean Referral Badge](https://web-platforms.sfo2.cdn.digitaloceanspaces.com/WWW/Badge%203.svg)](https://www.digitalocean.com/?refcode=6609dec273fa&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge)

## Introduction
**[Jellyfin](https://jellyfin.org)** is a free and open source media server that allows you to collect, manage and stream your media from your server to any device. It supports Movies, TV Shows, Music, Books and Photos. It is predominantly known for movies and TV shows and many people who are hosting it already for movies and TV shows also like to use it for their music. It can automatically fetch metadata for your movies and TV shows, subtitles (using a plugin) and provides a structured way to organize and stream your media. In this article, I will show you how to set up Jellyfin on your own device or on a VPS. I'll be using [DigitalOcean](https://m.do.co/c/6609dec273fa) as my cloud provider.

## Background
This article is being written on the backdrop of a 300% [increase](https://www.plex.tv/blog/new-lifetime-plex-pass-pricing/) in the price of the Lifetime Plex Pass. This prompted many users to look for alternatives to Plex who may be considering buying the lifetime pass. 
Jellyfin serves as the perfect alternative to Plex. It has no cost associated to it and also provides many benefits and features that are locked behind a paywall in Plex.

## Why Jellyfin is a better choice than Plex
There are several reasons that I consider Jellyfin to be a superior offering to Plex. They are listed below:

### Offline Download
On the free tier, Plex does now allow the client devices connected to it to download the media for offline use. This is a big deal breaker for many users who want to download their media offline to watch/listen to when an internet connection isn't available. 

### Hardware Acceleration
It isn't possible to stream or encode media in Plex with hardware video acceleration on the free tier. This makes it such that if the server isn't powerful enough (common when running on old hardware or a VPS) and the client requires the video to be encoded in a different codec while streaming, the standard CPU acceleration must be able to keep up with the video playback or the stream buffers continuosly as the server is unable to keep up. This also makes it so that the CPU is running at 100% capacity encoding the video and throttles other processes on the machine.

### Authentication
Plex Media Server requires you to create a Plex account on their own authentication servers and the same goes for any users for your media server. This not only leaves you dependent on Plex and their servers but also gives you less control and permissions for the users of your server.

## Installation
This section will discuss the installation of the Jellyfin server. There are several ways to install Jellyfin on different platforms. There are installers and archives for installation on Windows and MacOS. It can also be installed on several Linux distributions. You can see the complete list of downloads [here](https://jellyfin.org/downloads/). I will be installing Jellyfin in a container using Docker Compose.

### Selecting the Image
There are several container images available for Jellyfin. There's the official container [image](https://hub.docker.com/r/jellyfin/jellyfin/) provided by Jellyfin.
There's also an [image](https://hotio.dev/containers/jellyfin/) created by [hotio.dev](https://hotio.dev/).

My preferred image though is by [LinuxServer](https://www.linuxserver.io/) who maintain community images for a wide variety of applications. I prefer it due to their well documented images and proper permissions support with environment variables.

### Directory Structure
```sh
mkdir -p ~/services/jellyfin
cd jellyfin
```

### Compose
```yaml showLineNumbers title="compose.yaml"
---
services:
  jellyfin:
    image: lscr.io/linuxserver/jellyfin:latest
    container_name: jellyfin
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Etc/UTC
    volumes:
      - /opt/jellyfin/library:/config
      - /media/tvseries:/data/tvshows
      - /media/movies:/data/movies
    ports:
      - 8096:8096
      - 8920:8920 #optional
      - 7359:7359/udp #optional
      - 1900:1900/udp #optional
    restart: unless-stopped
```

### Starting the container
```sh
docker compose up -d
```

### Web Interface
The web interface should now be accessible at [`http://localhost:8096`](http://localhost:8096).

You can then continue setting up your server. You will be required to name your server, create an administrator account, add your media library and you will be good to go. Jellyfin automatically fetches the metadata for your media from the internet.

## Plugins
Jellyfin can also be extended by using plugins. One of the most popular plugins allows you to download and manage subtitles for your media from within Jellyfin.

## Client Applications
Jellyfin has many official client applications along with unofficial clients that aim to provide a better user interface or functionality than the official clients.
Here's a list of my recommended Jellyfin client programs for each platform:
### - Android: 
**[Findroid](https://github.com/jarnedemeulemeester/findroid)** is considered the best client application for Android. It is built with Material Design 3 and available on the Google Play Store and F-Droid

### - iOS/iPadOS
**[Swiftin](https://github.com/jellyfin/swiftfin)** is an open source frontend built for iOS and tvOS with a beautiful interface.

### - Windows/MacOS/Linux
**[Fladder](https://github.com/DonutWare/Fladder)** is a cross platform frontend for Jellyfin built on Flutter. It is supported on all three major desktop platforms, Android TV and can also be run in a container.

## Conclusion
This was a general introduction to Jellyfin, its features and extensibility. I hope this guide was useful to you. If you want me to write an article on creating a full media stack with Jellyfin, let me know in the comments. You may also check out my article on [Grimmory](https://abdulkareem.is-a.dev/posts/grimmory-install-guide), which is a dedicated book server.

Thanks for reading. Goodbye.
