---
author: Abdul Kareem
pubDatetime: 2026-05-03T15:50:00+05:00
title: Remapping Caps Lock to Escape on Linux
description: Turning one of the least used keys on the keyboard to (arguably) the most used.
slug: mapping-caps-lock-to-esc
featured: true
tags:
  - arch
  - open-source
  - neovim
hideEditPost: true
---

## My Neovim Journey

I'm an avid Neovim user. I've been using Neovim for about 20 months now. I've my own configuration originally created using the fantastic [Neovim for Newbs](https://typecraft.dev/neovim-for-newbs) course by [Typecraft](https://typecraft.dev).
I've since made plenty of iterations to my configuration. Changing some of the original plugins like [nvim-cmp](https://github.com/hrsh7th/nvim-cmp) for [blink.cmp](https://github.com/saghen/blink.cmp) among others. However, the most impactful change for me by far was by remapping my Caps Lock key to Ctrl.

## The Problem with Escaping Insert Mode

One of the most common actions in Neovim is to go to insert mode to make some edits, then return to normal mode.
The most commonly used keybind for this is `Esc`.
There are others such as `C-c` but they are used less commonly and may not even be known to a beginner.
I was one of these until a friend of mine who I introducted to Neovim told me about it.
In my opinion, both `Esc` and `C-c` are both away from the home row and requires you to move your little finger.
This not only causes significant strain on your finger as you have to consistently move your finger away from its position but particularly for people like me who have small hands, make it so that you also have to move your palm to properly reach the escape key.

## Solutions

### Option 1: Map `jk` / `kj` to Escape

The most commonly recommended solution for this by the community is to map `jk` and `kj` to `Esc`.

```lua title="init.lua" showLineNumbers
vim.keymap.set("i", "jk", "<Esc>")
vim.keymap.set("i", "kj", "<Esc>")
```

The above binds the key combinations `jk` and `kj` when pressed in insert mode to return `<Esc>` which returns the user to normal mode.
This does solve the issue for the majority of the users and was also my preferred solution at one point in time.
I recommend you try this and see the difference it brings to your workflow.

This is not the end, however.

<!-- There's one more thing we can do.  -->
<!-- Mapping Caps Lock to Escape.  -->

### Option 2: Remap Caps Lock (The Better Way)

#### Why Caps Lock is the Perfect Candidate

Caps Lock is one of the least used keys on your keyboard.
It is very rarely used when typing constants or SQL queries but not much more.
It's almost never used in normal typing. Hence, it mostly goes unused.
This makes it the perfect candidate to remap to more useful keys.
It's also situated on the home row making it very appealing.

## Setting up Interception Tools

I use [interception-tools](https://gitlab.com/interception/linux/tools) to map Caps Lock to Esc. From the [archwiki](https://wiki.archlinux.org/title/Interception-tools), interception-tools is a set of utilities to control and customize the behavior of keyboard input mappings. For most users it is a backend, and would use it with one of its plug-ins.

Interception-tools operates at a lower level compared to older similar tools (xcape, xmodmap) by using libevdev and libudev.
It thus works across X11 and Wayland.

### Installation

#### Arch Linux

```sh
yay -S interception-tools interception-caps2esc
```

#### Ubuntu

```sh
sudo add-apt-repository ppa:deafmute/interception
sudo apt install interception-tools
```

#### Fedora

```sh
sudo dnf copr enable fszymanski/interception-tools
sudo dnf install interception-tools
```

### Configuration

You can configure interception-tools with the configuration file at `/etc/interception/udevmon.yaml`

```sh
sudoedit /etc/interception/udevmon.yaml
```

Note: The `$EDITOR` variable must be set for `sudoedit` to work. You can see if it is set by:

```sh
echo $EDITOR
```

If it's not set, you may set it by adding the following line to your `~/.bashrc` or `~/.zshrc` depending on your shell.

```sh
EDITOR=nvim
```

This allows you to edit all files with your Neovim configuration instead of losing your configuration when you need to edit a file with `sudo`.

In the file, you can paste this snippet of code.

```yaml title="/etc/interception/udevmon.yaml" showLineNumbers
- JOB: "intercept -g $DEVNODE | caps2esc | uinput -d $DEVNODE"
  DEVICE:
    EVENTS:
      EV_KEY: [KEY_CAPSLOCK, KEY_ESC, KEY_LEFTCTRL]
```

This snippet does the following:

- When Caps Lock is pressed, Escape is executed.
- When Caps Lock is held, Ctrl is executed.
- When Esc is pressed, Caps Lock is executed.

Note: The Ctrl key has no change in its functionality and keeps working as is.

### Starting the service

```sh
sudo systemctl enable --now udevmon.service
```

That's it. You can now use your Caps Lock key as Escape. I also find that holding Caps Lock for Ctrl is incredibly helpful and has become a core part of my workflow. You can use it not only within Neovim for say, accepting completions with `C-y` or scrolling the completion menu with `C-j` and `C-k` respectively but also outside Neovim in your browser and wherever else you use Ctrl as it's a very commonly used modifier key.

## Conclusion

Whether you start with the `jk` mappings or jump straight to remapping Caps Lock, I'm confident this will be one of the better changes you can make to your workflow. I hope this article was useful for you. Thanks for reading. Goodbye.
