---
title: Deploying a FastAPI application on FastAPI Cloud
author: Abdul Kareem
pubDatetime: 2026-06-24T16:00:00Z
slug: fastapi-deployment-guide
featured: true
draft: false
tags:
  - fastapi
hideEditPost: true
description: A guide to deploy your FastAPI applications on FastAPI Cloud
---

## Introduction
FastAPI is used by developers all around the world to make production grade APIs. It provides a fast and type safe developer experience. In this blog, I'll guide you to deploying your FastAPI application on **FastAPI Cloud**, a new cloud platform by the same team behind FastAPI. 

## FastAPI Cloud
FastAPI Cloud is designed to be the default deployment platform for FastAPI applications. It's deeply integrated and specifically made for FastAPI apps. Some features that FastAPI provides by default are:
- Zero Downtime Deployments
- Secure by default with HTTPS certificates
- Custom Domains
- CI/CD Integration with GitHub for automatic deployments


Now, let's set up a FastAPI project that we will build and deploy. Before that, make sure you have created an account on [FastAPI Cloud](https://fastapicloud.com).

### Setting up the Project
Let's start scaffolding a basic FastAPI project to deploy. I'll be using the `uv` package manager to manage the project. If you want me to write an article on it, let me know in the comments.
```sh
uvx fastapi-new myapp
cd myapp
```
This will automatically create a default FastAPI project. You can now run the local development server with 
```sh
uv run fastapi dev
```

### Deploying the Project
Authorize the CLI application to your FastAPI Cloud account with 
```sh
uv run fastapi login
```

Then run
```sh
uv run fastapi deploy
```
This asks questions like the name of your application, location of the project configuration file `pyproject.toml` among others. It then starts the deployment process to FastAPI. After the deployment is complete, it will print the domain your application is deployed at to stdout. Visit the domain and see your application deployed.


### Envrionment Variables and Secrets
You can add the required environment variables from both the CLI and your account dashboard. To add them from the CLI,
#### Environment Variables
```sh
uv run fastapi cloud env set ENVIRONMENT "prod"
```
#### Secrets
Use the `--secret` flag to ensure that the secrets are encrypted and cannot be viewed from the web dashboard.
```sh
uv run fastapi cloud env set --secret SESSION_SECRET "your-session-secret"
```

You can also import a `.env` file in the dashboard to not have to enter all secrets one by one. Whatever you prefer.
### Setting up git integration
You may also connect the GitHub repository of your application to your deployment. This makes it such that whenever you push a commit, your application is automatically redeployed with the latest commit. This is my preferred way as I only have to push my code once to GitHub and FastAPI Cloud automatically pulls my code from there and deploys it. It also keeps the application up to date with local development. 

### Adding a custom domain
You can also add a custom domain for your application from the FastAPI dashboard. 

### Integrations
FastAPI Cloud also has integrations with Neon, Redis Cloud and Supabase so that you can easily add a database to your FastAPI application.

## Conclusion
FastAPI Cloud is still in beta and therefore, many things are still not currently defined. If you already have your applications deployed elsewhere, you may want to keep them there till it becomes more stable and production ready. If you are starting a new project from scratch or you have any hobby projects, then FastAPI Cloud is arguably one of the easiest places to deploy them to production. I hope this guide was helpful for you and you can now deploy your FastAPI applications easily and securely.

Thanks for reading. Goodbye.
