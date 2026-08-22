---
title: Your AI Agent Will Read Your .env File Anyway
description: AI coding agents don't stop at a denied permission prompt; here's how I locked my secrets away from them using Varlock and a GPG-backed password store.
pubDatetime: 2026-08-22T08:30:00Z
author: Abdul Kareem
slug: ai-proofing-env-secrets
featured: true
hideEditPost: true
tags: 
  - AI
  - Linux
  - Security
  - DevOps
  - Secrets Management
---

## Problem Statement
Let's start with some context. Historically, it has always been a difficult problem to keep your development secrets safe and in sync on different machines. It has been a long standing practice to keep `.env` files out of git. Basically every `.gitignore` template includes `.env` by default. To provide context, developers often used conventions such as `.env.local` as documentation of what environment variables are required for the application.

These days however, AI coding agents such as Claude Code, Codex, OpenCode and basically all others run with full filesystem access[^1] by default. This poses a problem where full filesystem access means they can (potentially) read/write everything on disk. Now you may ask what's the problem with this? OpenCode by default doesn't allow its agents to read the `.env` files and requires a permission prompt[^2]. The user may accept or deny this request to read the `.env` file here. You may think this is the end (but unfortunately it isn't).

### Circumventing the "Sandbox"
There isn't just one way for an agent to read a file on disk. While using the agent's own read tool is the first one it will reach out for, there are many other ways. And the agents don't hesitate in using them provided you deny their initial request. Let's go over some of these.

#### Using `cat`
```sh
cat .env
```

#### Using `python`
```py
with open(".env") as f:
  content = f.read()
print(content)
```

There are also plenty of other ways to circumvent their restrictions. The point I'm trying to make is that they will try every possible way to read your secrets/environment variables. They need the context. How does one ensure that they can get the proper context while also making sure that their secrets aren't leaked?

### My Requirements
Let's talk about what my criteria is for securing my secrets.

- Secrets should not exist on disk unencrypted.
- Secrets must be injected into the application process at runtime.
- Developers/AI agents must have some sort of convention to be able to know what the secrets are.


## The Solution: Varlock
[Varlock](https://varlock.dev) is a tool designed to solve this exact problem. It exposes a `.env.schema` file that is readable by agents and humans alike. The agents get the full context of the environment variables required and the humans can also use it.

### Installation

```sh
curl -sSfL https://varlock.dev/install.sh | sh -s
```

## Storing Secrets with Pass
Varlock is only the first step though. Varlock solves the problem of injecting secrets into the application process at runtime and also creates a schema for both humans and agents. We also need to store our secrets somewhere where Varlock can reach them and inject them into our application at runtime. Varlock has many different integrations with different secret stores including 1Password, Bitwarden, HashiCorp Vault, Infisical, AWS Secrets Manager and many others. You can explore what platforms are supported here along with their documentation for integrating them into Varlock [here](https://varlock.dev/plugins/overview/).

I'll be using [pass](https://www.passwordstore.org/) as my secret store of choice. There are several reasons for my choice.
- Completely Offline
- Scriptable and Extensible
- Easy to Backup

Now let's first set up `pass` on my machine.
### Installation
```sh
paru -S pass
```

### Generating the PGP keys
Pass requires a PGP key pair for encrypting the passwords/secrets.

Generate it via the following command:
```sh
gpg --full-generate-key
```
You'll be given a few options to choose from.
- Algorithm: RSA and RSA
- Keysize: 4096
- Validity of the Key: Always
- Name: "your-name"
- Email: "your-email"
- Comment: Password Store

After these options have been selected, you'll be asked to create a passphrase for your key. It's important that you create a very strong password/passphrase for this. This is the key to your PGP key and subsequently, your password store.

After you enter the password, you'll be informed that the key has been generated.
```sh
gpg: revocation certificate stored as '/home/abdulkareem/.gnupg/openpgp-revocs.d/A3D47AD1265A747BF9D1C50587F660B3BC7E83D8.rev'
public and secret key created and signed.

pub   rsa4096 2026-08-22 [SC]
      A3D47AD1265A747BF9D1C50587F660B3BC7E83D8
uid                      Abdul Kareem (Password Store) <me@abdulkareem.tech>
sub   rsa4096 2026-08-22 [E]
```

The string of characters below the public key is your fingerprint for the key. Copy it.

### Initializing the Password Store
We'll now use this to create the password store.
```sh
pass init A3D47AD1265A747BF9D1C50587F660B3BC7E83D8
```

This will initialize the password store at `~/.password-store`.
This contains all your secrets as encrypted GPG files.

### Backing Up to Git
It's also possible to push these secrets to GitHub[^3] as `pass` has first-class git integration.
To initialize the git repository, make sure you are in the `~/.password-store` directory.
```sh
~/.password-store
$ pass git init
$ git branch -m main
$ git remote add origin git@github.com:<your-github-username>/varlock-password-store
$ git push -u origin main
```

Now whenever you modify your password store, it is automatically committed. You can also create a git hook to automatically push your changes to GitHub.

Navigate to `~/.password-store/.git/hooks` and create the following hook.
```sh title="~/.password-store/.git/hook/post-commit"
git push origin main
```

```sh
chmod +x post-commit
```

Now you have a version controlled password store that automatically backs itself up to a remote origin whenever you make a change.

## Building a Sample Project
Now let's create a sample project to see the full capabilities of Varlock and how it all integrates together.
```sh
mkdir varlock_sample
cd varlock_sample

uv init

cat > .env << 'EOF'
WEATHER_API_KEY=
SESSION_SECRET=
DATABASE_URL=
EOF

varlock init
```

### Generating the Schema
You have two ways to generate the `.env.schema` file.
You can either create it manually based on the documentation or you can create it automatically using `varlock init`.
I recommend using `varlock init`. It automatically parses your `.env` file and creates a `.env.schema` file.

### Wiring up `pass`
Let's insert the required values into our password store first and then set up varlock to fetch them.

```sh
pass insert sample-project/weather-api-key
pass insert sample-project/session-secret
pass insert sample-project/database-url
```
Add these two lines at the top of your `.env.schema` file to load the pass plugin.
```sh title=".env.schema"
# @plugin(@varlock/pass-plugin@1.0.0)
# @initPass(namePrefix=sample-project/)
```

Then for each secret,
```sh title=".env.schema"
# @sensitive
WEATHER_API_KEY=pass("weather-api-key")
# @sensitive
SESSION_SECRET=pass("session-secret")
# @type=url
DATABASE_URL=pass("database-url")
```

To run the application, let's setup a script in pyproject.toml.
```toml title="pyproject.toml"
[project.scripts]
app = "varlock_sample:main"
```

and for our main script.
```py title="varlock_sample/src/varlock_sample/__init__.py"
import os


def main() -> None:
    print("WEATHER_API_KEY: ", os.environ["WEATHER_API_KEY"])
    print("SESSION_SECRET: ", os.environ["SESSION_SECRET"])
    print("DATABASE_URL: ", os.environ["DATABASE_URL"])
```

To now run the dev server with the injected secrets, use the following command.
```sh
$ varlock run -- uv run app
WEATHER_API_KEY:  my-weather-api-key
SESSION_SECRET:  my-session-secret
DATABASE_URL:  postgres://something
```

When you run the process, you'll be prompted to enter your passphrase. This is required to decrypt the secrets.

Since the values load straight into the operating system process, you're not locked into any one config tool; you can read them with plain os.environ, python-dotenv's os.getenv, Pydantic's BaseSettings, or anything else that you use.

## Integrations 
Varlock has integrations with many different JavaScript runtimes and frameworks. It also has integrations with Rust, Python, Go, Java, PHP and C#. You can see all the available integrations [here](https://varlock.dev/integrations/overview/).

## Versions
To avoid any confusion, these are the tool versions I used as of the writing of this article.
<details>
<summary>Tool versions used in this article</summary>

| Tool    | Version         |
|---------|------------------|
| git     | 2.55.0           |
| gpg     | 2.4.9 (libgcrypt 1.12.2) |
| pass    | 1.7.4            |
| varlock | 1.16.1           |

</details>

## Conclusion
This is my current solution to my secrets management problems. I can easily backup all of my secrets to GitHub to make them portable as well (as far as I'm concerned, I'm a solo developer). My GPG keys and passphrase are backed up to Bitwarden and I can rest easy knowing no clanker is going to read my secrets.
I hope this was informative and you can also set up this system for proper secrets management for your projects.
Thank you for reading. Goodbye.

---

[^1]: This isn't inherently true. They start with read/write permissions in only the directory they are launched in but they can and do ask permissions for other directories if and when it's required.

[^2]: I've primarily written this from the point of view of an OpenCode user as that is the one I use the most but I've encountered similar behavior in Codex and Antigravity as well.

[^3]: You can use any git remote. I personally use GitHub.
