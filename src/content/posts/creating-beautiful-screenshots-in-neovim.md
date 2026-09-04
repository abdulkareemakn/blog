---
title: Creating Beautiful Screenshots in Neovim
description: Ever want to take a proper, high quality screenshot of your code and share it? Find out how in this post.
pubDatetime: 2026-08-16T19:00:00Z
author: Abdul Kareem
featured: false
hideEditPost: true
draft: true
tags:
  - neovim
  - open source
---

## Introduction

If you have ever wanted to share a screenshot of your code with someone, whether it be a colleague or on social media, you know the hassle of trying to get a perfect screenshot. Zooming in to only your code making the final screenshot be small and blurry. Not getting proper syntax highlighting, breadcrumbs support or line numbers. These are common issues when you are taking a screenshot of your editor. But it doesn't have to be this hard. In this post, I'll introduce a neovim plugin to create proper, beautiful screenshots with title bars, line numbers, syntax highlighting, fonts and colorscheme of your choice.

## Silicon

[Silicon](https://github.com/aloxaf/silicon) is an alternative to [Carbon](https://github.com/dawnlabs/carbon) (another screenshot tool) written in Rust. It allows you to render your source code to beautiful images.

To set up Silicon on Neovim, we need to first install the Silicon binary on our system.
On Arch Linux, it is available in the `extra` repository.

```sh
paru -S silicon
```

After we have the `silicon` binary installed, we can install our neovim plugin.
I have my configuration set up such that my plugins go at `~/.config/nvim/lua/plugins/`.

Let's create our new file now.

```lua title="silicon.lua" showLineNumbers
return {
	"michaelrommel/nvim-silicon",
	lazy = true,
	cmd = "Silicon",
	main = "nvim-silicon",
	opts = {
		-- Configuration here, or leave empty to use defaults
		line_offset = function(args)
			return args.line1
		end,

		theme = "GitHub",
		font = "GeistMono Nerd Font",
		to_clipboard = true,

		window_title = function()
			return vim.fn.fnamemodify(vim.api.nvim_buf_get_name(vim.api.nvim_get_current_buf()), ":t")
		end,

		output = function()
			-- 1. Define your absolute path
			local dir = "/home/tmtaxman/Pictures/Code/"

			-- 2. Get the current file extension (e.g., 'lua', 'cpp', 'js')
			local filename = vim.fn.expand("%:t")

			-- 3. Safety check: if file has no extension (like a Makefile), default to 'code' or 'txt'
			if filename == "" then
				filename = "code"
			end

			-- 4. Return the full path
			return dir .. os.date("%m-%d_%H-%M") .. "_" .. filename .. ".png"
		end,
	},
}
```
