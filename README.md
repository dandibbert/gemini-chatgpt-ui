# gemini-chatgpt-ui

A clean, zero-dependency userscript that restyles Google Gemini (`gemini.google.com`) to look and feel like ChatGPT — supporting both Light and Dark themes, ScriptCat, Tampermonkey, Violentmonkey, and Ardia.

## Install / Auto-Update

Install directly via Raw URL (auto-updates supported via `@updateURL` / `@downloadURL`):

- Raw script: https://raw.githubusercontent.com/dandibbert/gemini-chatgpt-ui/main/gemini-chatgpt-ui.user.js

## Features

- **ChatGPT Light & Dark Palette**: `#ffffff` / `#f9f9f9` in light mode; `#212121` / `#171717` in dark mode.
- **Cohesive Centered Column**: Unifies user queries, markdown prose, tables, code blocks, follow-ups, and the composer to `768px` (with a header toggle for `960px` wide mode).
- **Compact User Bubbles & Hover Actions**: Replaces oversized `40px` rounded bubbles with compact `20px` pills and reveals per-turn action bars on hover.
- **ChatGPT Sidebar & Composer**: `260px` sidebar with `8px` rounded items, subtle composer elevation shadow, circular send button, and optional toggle to hide extra sidebar sections (`Library` / `Images` / `Notebooks`).
- **Trusted Types Safe**: Builds injected header elements via pure DOM APIs (`createElement` / `textContent`, zero `innerHTML`).
