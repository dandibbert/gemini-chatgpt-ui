// ==UserScript==
// @name         gemini-chatgpt-ui
// @namespace    https://github.com/dandibbert/gemini-chatgpt-ui
// @version      0.2.4
// @description  Restyle Google Gemini web UI to look and feel like ChatGPT (clean layout, typography, 768px column, compact bubbles, ChatGPT sidebar & composer, dark/light support)
// @author       dandibbert
// @match        https://gemini.google.com/*
// @run-at       document-start
// @noframes
// @grant        none
// @homepageURL  https://github.com/dandibbert/gemini-chatgpt-ui
// @supportURL   https://github.com/dandibbert/gemini-chatgpt-ui/issues
// @updateURL    https://raw.githubusercontent.com/dandibbert/gemini-chatgpt-ui/main/gemini-chatgpt-ui.user.js
// @downloadURL  https://raw.githubusercontent.com/dandibbert/gemini-chatgpt-ui/main/gemini-chatgpt-ui.user.js
// ==/UserScript==

(() => {
  const STYLE_ID = "cg-gemini-style";
  const HEADER_ID = "cg-chatgpt-header";
  const STORAGE_WIDE = "cg_gemini_wide_mode";
  const STORAGE_CLEAN_NAV = "cg_gemini_clean_sidebar";

  const CSS = `
/* ==========================================================================
   ChatGPT-inspired Theme Tokens (Light & Dark)
   ========================================================================== */
:root,
body.light-theme,
.theme-host.light-theme {
  --cg-font-sans: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif;
  --cg-font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  --cg-col-width: 768px;

  --cg-bg-main: #ffffff;
  --cg-bg-sidebar: #f9f9f9;
  --cg-bg-elevated: #ffffff;
  --cg-bg-hover: #ececec;
  --cg-bg-active: #e3e3e3;
  --cg-bg-bubble: #f4f4f4;
  --cg-bg-code: #f9f9f9;
  --cg-bg-code-head: #f1f1f1;
  --cg-bg-table-head: #f7f7f8;
  --cg-bg-chip: #f7f7f8;

  --cg-text: #0d0d0d;
  --cg-text-muted: #5d5d5d;
  --cg-text-faint: #8f8f8f;

  --cg-border: rgba(0, 0, 0, 0.08);
  --cg-border-strong: rgba(0, 0, 0, 0.14);
  --cg-composer-shadow: 0 4px 18px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.09);
  --cg-composer-shadow-focus: 0 6px 22px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.22);

  --cg-send-bg: #0d0d0d;
  --cg-send-fg: #ffffff;
  --cg-send-disabled-bg: #e5e5e5;
  --cg-send-disabled-fg: #9e9e9e;

  --bard-chat-window-content-width-default: var(--cg-col-width) !important;
  --bard-chat-window-max-width-default: calc(var(--cg-col-width) + 16px) !important;
  --bard-color-sidenav-background-desktop: var(--cg-bg-sidebar) !important;
  --bard-color-sidenav-background-mobile: var(--cg-bg-sidebar) !important;
  --bard-color-surface-dim-tmp: var(--cg-bg-main) !important;
  --bard-color-remy-surface: var(--cg-bg-main) !important;
  --gem-sys-color--on-surface: var(--cg-text) !important;
  --gem-sys-color--on-surface-variant: var(--cg-text-muted) !important;
  --bard-sidenav-open-width: 260px !important;
  --bard-sidenav-open-closed-width-diff: 208px !important;
}

body.dark-theme,
.theme-host.dark-theme {
  --cg-bg-main: #212121;
  --cg-bg-sidebar: #171717;
  --cg-bg-elevated: #303030;
  --cg-bg-hover: #212121;
  --cg-bg-active: #2f2f2f;
  --cg-bg-bubble: #2f2f2f;
  --cg-bg-code: #0d0d0d;
  --cg-bg-code-head: #1c1c1c;
  --cg-bg-table-head: #2a2a2a;
  --cg-bg-chip: #2a2a2a;

  --cg-text: #ececec;
  --cg-text-muted: #b4b4b4;
  --cg-text-faint: #8e8e8e;

  --cg-border: rgba(255, 255, 255, 0.08);
  --cg-border-strong: rgba(255, 255, 255, 0.16);
  --cg-composer-shadow: 0 4px 20px rgba(0, 0, 0, 0.28), 0 0 0 1px rgba(255, 255, 255, 0.09);
  --cg-composer-shadow-focus: 0 6px 24px rgba(0, 0, 0, 0.36), 0 0 0 1px rgba(255, 255, 255, 0.22);

  --cg-send-bg: #ffffff;
  --cg-send-fg: #0d0d0d;
  --cg-send-disabled-bg: #444444;
  --cg-send-disabled-fg: #212121;

  --bard-color-sidenav-background-desktop: var(--cg-bg-sidebar) !important;
  --bard-color-sidenav-background-mobile: var(--cg-bg-sidebar) !important;
  --bard-color-surface-dim-tmp: var(--cg-bg-main) !important;
  --bard-color-remy-surface: var(--cg-bg-main) !important;
  --gem-sys-color--on-surface: var(--cg-text) !important;
  --gem-sys-color--on-surface-variant: var(--cg-text-muted) !important;
  --gem-sys-color--surface-container: #2a2a2a !important;
  --gem-sys-color--surface-container-high: #323232 !important;
  --gem-sys-color--surface-container-highest: #3a3a3a !important;
}

html.cg-wide {
  --cg-col-width: 960px;
}

/* ==========================================================================
   Global Canvas & Typography
   ========================================================================== */
html, body, chat-app, main.chat-app {
  background-color: var(--cg-bg-main) !important;
  color: var(--cg-text) !important;
  font-family: var(--cg-font-sans) !important;
  -webkit-font-smoothing: antialiased;
}

chat-window,
.chat-container,
.chat-history-scroll-container,
infinite-scroller.chat-history {
  background-color: var(--cg-bg-main) !important;
}

/* Remove Gemini ambient glow & harsh scrims */
.lm-glow,
.autosuggest-scrim {
  display: none !important;
}

/* Subtle ChatGPT-style scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track,
::-webkit-scrollbar-corner {
  background: transparent !important;
}
::-webkit-scrollbar-thumb {
  background: var(--cg-border-strong) !important;
  border-radius: 9999px !important;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--cg-text-faint) !important;
}
* {
  scrollbar-color: var(--cg-border-strong) transparent;
  scrollbar-width: thin;
}

/* ==========================================================================
   Sidebar (ChatGPT Left Navigation)
   ========================================================================== */
bard-sidenav-container,
bard-sidenav-content,
side-navigation-v2 {
  background-color: var(--cg-bg-main) !important;
}

bard-sidenav {
  background-color: var(--cg-bg-sidebar) !important;
  border-right: 1px solid var(--cg-border) !important;
}

bard-sidenav.sidenav-open,
bard-sidenav.sidenav-open .sidenav-with-history-container {
  width: 260px !important;
  min-width: 260px !important;
}

bard-sidenav .sidenav-with-history-container,
bard-sidenav side-navigation-content,
bard-sidenav .overflow-container {
  background-color: var(--cg-bg-sidebar) !important;
}

bard-sidenav .top-gradient-container,
bard-sidenav .bottom-gradient-container {
  opacity: 0 !important;
  pointer-events: none !important;
}

/* Sidebar nav links & conversation items: 8px rounded instead of giant pills */
bard-sidenav a.mdc-list-item,
bard-sidenav button.mdc-list-item,
bard-sidenav .gem-nav-list-item {
  border-radius: 8px !important;
  min-height: 34px !important;
  height: 34px !important;
  font-family: var(--cg-font-sans) !important;
  font-size: 13.5px !important;
  color: var(--cg-text) !important;
}

bard-sidenav conversations-list a.mdc-list-item,
bard-sidenav .top-action-list a.mdc-list-item,
bard-sidenav .top-action-list-scrollable a.mdc-list-item,
bard-sidenav .top-action-list-scrollable button.mdc-list-item {
  margin: 1px 6px !important;
  width: calc(100% - 12px) !important;
}

bard-sidenav a.mdc-list-item:hover,
bard-sidenav button.mdc-list-item:hover {
  background-color: var(--cg-bg-hover) !important;
}

bard-sidenav a.is-active,
bard-sidenav a.mdc-list-item--activated,
bard-sidenav a[aria-current="page"] {
  background-color: var(--cg-bg-active) !important;
  font-weight: 500 !important;
}

/* Compact secondary nav sections (Library, Images, Scheduled, Daily brief, Notebooks) */
bard-sidenav .top-action-list-scrollable a.mdc-list-item,
bard-sidenav .top-action-list-scrollable button.mdc-list-item {
  min-height: 30px !important;
  height: 30px !important;
  font-size: 13px !important;
  color: var(--cg-text-muted) !important;
}

html.cg-clean-sidebar bard-sidenav .top-action-list-scrollable,
html.cg-clean-sidebar bard-sidenav expandable-section:has([aria-label*="Notebooks"]),
html.cg-clean-sidebar bard-sidenav .section-divider {
  display: none !important;
}

bard-sidenav .expandable-section-header {
  font-size: 11.5px !important;
  font-weight: 600 !important;
  color: var(--cg-text-faint) !important;
  letter-spacing: 0.02em !important;
  height: 28px !important;
  min-height: 28px !important;
}

bard-sidenav sidenav-mavatar-footer,
bard-sidenav mat-action-list.desktop-controls {
  border-top: 1px solid var(--cg-border) !important;
  background-color: var(--cg-bg-sidebar) !important;
}

/* ==========================================================================
   Sticky Minimal ChatGPT Top Header Bar
   ========================================================================== */
#${HEADER_ID} {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  height: 52px;
  padding: 0 56px 0 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  z-index: 12;
  pointer-events: none;
  background: linear-gradient(to bottom, var(--cg-bg-main) 68%, transparent);
}

#${HEADER_ID} .cg-header-left,
#${HEADER_ID} .cg-header-right {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  pointer-events: auto;
}

#${HEADER_ID} .cg-model-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 10px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: var(--cg-text);
  font-family: var(--cg-font-sans);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 120ms ease;
}
#${HEADER_ID} .cg-model-pill:hover {
  background-color: var(--cg-bg-hover);
}
#${HEADER_ID} .cg-model-pill .cg-model-tag {
  font-size: 12px;
  font-weight: 500;
  color: var(--cg-text-muted);
  padding: 2px 7px;
  border-radius: 6px;
  background: var(--cg-bg-bubble);
}

#${HEADER_ID} .cg-chat-title {
  font-size: 13px;
  color: var(--cg-text-faint);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 34vw;
}

#${HEADER_ID} .cg-hdr-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 30px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid var(--cg-border);
  background: var(--cg-bg-elevated);
  color: var(--cg-text-muted);
  font-family: var(--cg-font-sans);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 120ms ease, color 120ms ease, border-color 120ms ease;
}
#${HEADER_ID} .cg-hdr-btn:hover {
  background: var(--cg-bg-hover);
  color: var(--cg-text);
  border-color: var(--cg-border-strong);
}
#${HEADER_ID} .cg-hdr-btn.is-on {
  color: var(--cg-text);
  background: var(--cg-bg-bubble);
  border-color: var(--cg-border-strong);
}

top-bar-actions {
  z-index: 15 !important;
}

/* ==========================================================================
   Chat Conversation Column & Turns
   ========================================================================== */
/* In-flow ChatGPT layout when conversation exists: prevents composer from ever overlapping responses */
.chat-container:has(.conversation-container) {
  display: flex !important;
  flex-direction: column !important;
  overflow: hidden !important;
}

.chat-container:has(.conversation-container) .chat-history-scroll-container {
  box-sizing: border-box !important;
  flex: 1 1 0% !important;
  min-height: 0 !important;
  height: auto !important;
  max-height: none !important;
}

.chat-container:has(.conversation-container) infinite-scroller.chat-history {
  box-sizing: border-box !important;
  height: 100% !important;
  flex: 1 1 auto !important;
  padding-top: 56px !important;
  padding-bottom: 28px !important;
}

.chat-container:has(.conversation-container) input-container {
  position: relative !important;
  top: auto !important;
  bottom: auto !important;
  left: auto !important;
  right: auto !important;
  width: 100% !important;
  flex: 0 0 auto !important;
  background: var(--cg-bg-main) !important;
  padding-top: 10px !important;
  z-index: 10 !important;
}

infinite-scroller.chat-history {
  padding-top: 56px !important;
  padding-bottom: 140px !important;
}

.conversation-container {
  padding-top: 6px !important;
  padding-bottom: 6px !important;
}

/* Unify turn width to ChatGPT 768px (or 960px in wide mode) */
user-query,
.response-container-header,
.response-container-footer,
.markdown-main-panel,
model-thoughts,
.thoughts-container,
follow-up,
freemium-rag-disclaimer {
  max-width: min(var(--cg-col-width), calc(100% - 32px)) !important;
  margin-inline: auto !important;
}

.markdown-main-panel {
  display: block !important;
  width: 100% !important;
}

.markdown-main-panel > * {
  max-width: 100% !important;
  margin-inline: 0 !important;
}

user-query {
  width: 100% !important;
  margin-top: 14px !important;
  margin-bottom: 6px !important;
}

user-query-content > .user-query-container {
  max-width: 75% !important;
}

/* Compact ChatGPT User Bubble */
.user-query-bubble-with-background {
  background-color: var(--cg-bg-bubble) !important;
  color: var(--cg-text) !important;
  border-radius: 20px !important;
  padding: 10px 18px !important;
  max-width: 100% !important;
  font-family: var(--cg-font-sans) !important;
  font-size: 15.5px !important;
  line-height: 1.6 !important;
  box-shadow: none !important;
}

user-query .query-content {
  min-height: 0 !important;
}

.user-query-bubble-with-background .query-text,
.user-query-bubble-with-background .query-text-line {
  font-family: var(--cg-font-sans) !important;
  font-size: 15.5px !important;
  line-height: 1.6 !important;
  color: var(--cg-text) !important;
}

/* Model Response Typography (ChatGPT Prose) */
model-response .markdown-main-panel,
message-content .markdown-main-panel {
  font-family: var(--cg-font-sans) !important;
  font-size: 16px !important;
  line-height: 1.7 !important;
  color: var(--cg-text) !important;
}

.markdown-main-panel p {
  margin-top: 0.75em !important;
  margin-bottom: 0.75em !important;
}
.markdown-main-panel p:first-child {
  margin-top: 0 !important;
}

.markdown-main-panel h1,
.markdown-main-panel h2,
.markdown-main-panel h3,
.markdown-main-panel h4 {
  font-family: var(--cg-font-sans) !important;
  font-weight: 600 !important;
  color: var(--cg-text) !important;
  letter-spacing: -0.01em !important;
  margin-top: 1.35em !important;
  margin-bottom: 0.55em !important;
}
.markdown-main-panel h1 { font-size: 1.5em !important; }
.markdown-main-panel h2 { font-size: 1.25em !important; }
.markdown-main-panel h3 { font-size: 1.1em !important; }

.markdown-main-panel ul,
.markdown-main-panel ol {
  margin-top: 0.6em !important;
  margin-bottom: 0.85em !important;
  padding-left: 1.5em !important;
}
.markdown-main-panel li {
  margin-top: 0.3em !important;
  margin-bottom: 0.3em !important;
}

.markdown-main-panel hr {
  border: none !important;
  border-top: 1px solid var(--cg-border) !important;
  margin: 1.5em auto !important;
}

.markdown-main-panel blockquote {
  border-left: 3px solid var(--cg-border-strong) !important;
  padding-left: 14px !important;
  color: var(--cg-text-muted) !important;
}

/* Inline Code & Code Blocks */
.markdown-main-panel code:not(pre code) {
  font-family: var(--cg-font-mono) !important;
  font-size: 0.875em !important;
  background-color: var(--cg-bg-bubble) !important;
  color: var(--cg-text) !important;
  padding: 2px 6px !important;
  border-radius: 6px !important;
}

code-block,
.markdown-main-panel .code-block {
  border-radius: 12px !important;
  border: 1px solid var(--cg-border) !important;
  background-color: var(--cg-bg-code) !important;
  overflow: hidden !important;
  margin: 14px 0 !important;
}
code-block .formatted-code-block-internal-container {
  background-color: var(--cg-bg-code) !important;
  border-radius: 12px !important;
  padding: 0 !important;
  overflow: hidden !important;
  color: var(--cg-text) !important;
}
code-block .code-block-decoration,
code-block .header-formatted {
  background-color: var(--cg-bg-code-head) !important;
  border-bottom: 1px solid var(--cg-border) !important;
  font-family: var(--cg-font-sans) !important;
  font-size: 12px !important;
  font-weight: 500 !important;
  color: var(--cg-text-muted) !important;
  padding: 4px 12px 4px 16px !important;
  min-height: 36px !important;
  height: auto !important;
}
code-block .code-block-decoration > span,
code-block .code-block-decoration .buttons,
code-block .code-block-decoration .buttons button,
code-block .code-block-decoration .buttons mat-icon {
  color: var(--cg-text-muted) !important;
}
code-block .code-block-decoration .buttons button:hover,
code-block .code-block-decoration .buttons button:hover mat-icon {
  color: var(--cg-text) !important;
}
code-block pre {
  background-color: var(--cg-bg-code) !important;
  color: var(--cg-text) !important;
  margin: 0 !important;
  padding: 0 !important;
}
code-block code,
code-block code.code-container {
  font-family: var(--cg-font-mono) !important;
  font-size: 13.5px !important;
  line-height: 1.55 !important;
  background-color: var(--cg-bg-code) !important;
  color: var(--cg-text) !important;
  padding: 14px 16px !important;
  display: block !important;
  overflow-x: auto !important;
}

/* Syntax highlighting tuned for Light & Dark ChatGPT code blocks */
body.light-theme code-block .hljs,
body.light-theme code-block .hljs-subst,
body.light-theme code-block .hljs-function,
body.light-theme code-block .hljs-params,
body.light-theme code-block .hljs-punctuation,
body.light-theme code-block .hljs-operator {
  color: #24292f !important;
}
body.light-theme code-block .hljs-comment,
body.light-theme code-block .hljs-quote {
  color: #6e7781 !important;
}
body.light-theme code-block .hljs-keyword,
body.light-theme code-block .hljs-selector-tag,
body.light-theme code-block .hljs-type,
body.light-theme code-block .hljs-meta {
  color: #cf222e !important;
}
body.light-theme code-block .hljs-string,
body.light-theme code-block .hljs-doctag,
body.light-theme code-block .hljs-regexp {
  color: #0a3069 !important;
}
body.light-theme code-block .hljs-title,
body.light-theme code-block .hljs-section,
body.light-theme code-block .hljs-selector-id,
body.light-theme code-block .hljs-selector-class {
  color: #8250df !important;
}
body.light-theme code-block .hljs-number,
body.light-theme code-block .hljs-literal,
body.light-theme code-block .hljs-variable,
body.light-theme code-block .hljs-template-variable,
body.light-theme code-block .hljs-attr,
body.light-theme code-block .hljs-attribute,
body.light-theme code-block .hljs-built_in {
  color: #0550ae !important;
}
body.light-theme code-block .hljs-property {
  color: #953800 !important;
}

body.dark-theme code-block .hljs,
body.dark-theme code-block .hljs-subst,
body.dark-theme code-block .hljs-function,
body.dark-theme code-block .hljs-params {
  color: #ececec !important;
}
body.dark-theme code-block .hljs-comment,
body.dark-theme code-block .hljs-quote {
  color: #8e8e8e !important;
}
body.dark-theme code-block .hljs-keyword,
body.dark-theme code-block .hljs-selector-tag,
body.dark-theme code-block .hljs-meta {
  color: #df3079 !important;
}
body.dark-theme code-block .hljs-string,
body.dark-theme code-block .hljs-doctag {
  color: #00a67d !important;
}
body.dark-theme code-block .hljs-title,
body.dark-theme code-block .hljs-section,
body.dark-theme code-block .hljs-selector-class {
  color: #d2a8ff !important;
}
body.dark-theme code-block .hljs-number,
body.dark-theme code-block .hljs-literal,
body.dark-theme code-block .hljs-attr,
body.dark-theme code-block .hljs-variable,
body.dark-theme code-block .hljs-built_in {
  color: #e9950c !important;
}

/* Clean Markdown links (remove dashed Gemini underlines) */
.markdown-main-panel a:not(.mat-mdc-button-base) {
  text-decoration: underline !important;
  text-decoration-style: solid !important;
  text-underline-offset: 3px !important;
  text-decoration-thickness: 1px !important;
}

/* Tables */
.markdown-main-panel table {
  width: 100% !important;
  border-collapse: collapse !important;
  margin: 1em 0 !important;
  font-size: 14.5px !important;
  border: 1px solid var(--cg-border) !important;
  border-radius: 10px !important;
}
.markdown-main-panel thead th {
  background-color: var(--cg-bg-table-head) !important;
  color: var(--cg-text) !important;
  font-weight: 600 !important;
  text-align: left !important;
  padding: 9px 12px !important;
  border-bottom: 1px solid var(--cg-border-strong) !important;
}
.markdown-main-panel tbody td {
  padding: 8px 12px !important;
  border-bottom: 1px solid var(--cg-border) !important;
}
.markdown-main-panel tbody tr:last-child td {
  border-bottom: none !important;
}

/* Hover-reveal Action Bars (ChatGPT style) */
user-query .luminous-actions-container,
.conversation-container .response-container-footer {
  opacity: 0;
  transition: opacity 150ms ease;
}
.conversation-container:last-of-type .response-container-footer {
  opacity: 0.72;
}
.conversation-container:hover user-query .luminous-actions-container,
.conversation-container:focus-within user-query .luminous-actions-container,
.conversation-container:hover .response-container-footer,
.conversation-container:focus-within .response-container-footer,
.conversation-container:last-of-type:hover .response-container-footer {
  opacity: 1 !important;
}

/* Follow-up suggestion chips */
follow-up .follow-up-container {
  margin-top: 8px !important;
}
follow-up .follow-up-button {
  border-radius: 14px !important;
  background-color: var(--cg-bg-chip) !important;
  border: 1px solid var(--cg-border) !important;
  color: var(--cg-text) !important;
  font-family: var(--cg-font-sans) !important;
  font-size: 13.5px !important;
  padding: 6px 14px !important;
}
follow-up .follow-up-button:hover {
  background-color: var(--cg-bg-hover) !important;
  border-color: var(--cg-border-strong) !important;
}

/* ==========================================================================
   Bottom Composer (ChatGPT Input Box)
   ========================================================================== */
input-container {
  background: linear-gradient(to top, var(--cg-bg-main) 72%, transparent) !important;
  padding-top: 12px !important;
}
input-container.input-gradient-overlay::before,
input-container.input-gradient-overlay::after {
  display: none !important;
}

input-container .input-area-container,
input-container prompt-flow-bar,
input-container resque-banner {
  max-width: min(var(--cg-col-width), calc(100% - 32px)) !important;
  width: 100% !important;
  margin-inline: auto !important;
}

input-area-v2 {
  background-color: var(--cg-bg-elevated) !important;
  border-radius: 26px !important;
  box-shadow: var(--cg-composer-shadow) !important;
  border: none !important;
  transition: box-shadow 150ms ease !important;
}
input-area-v2:focus-within {
  box-shadow: var(--cg-composer-shadow-focus) !important;
}

input-area-v2 .text-input-field,
input-area-v2 fieldset.input-area-fieldset {
  background: transparent !important;
  padding-inline: 10px !important;
}

/* Composer & Sent Image Attachment Previews (clear border for white screenshots + safe stacking) */
input-area-v2 .attachment-preview-wrapper {
  overflow-x: auto !important;
  overflow-y: visible !important;
}
input-area-v2 gem-media-attachment mat-basic-chip {
  border-radius: 14px !important;
  border: none !important;
  box-shadow: 0 0 0 1px var(--cg-border-strong) !important;
  background-color: var(--cg-bg-bubble) !important;
  isolation: isolate !important;
}
input-area-v2 gem-media-attachment .gem-attachment-style-img {
  z-index: 0 !important;
  border-radius: 14px !important;
}
input-area-v2 gem-media-attachment .gem-attachment-content {
  z-index: 2 !important;
}
user-query-file-preview .preview-image-button,
.file-preview-container .preview-image-button {
  border-radius: 12px !important;
  overflow: hidden !important;
  border: 1px solid var(--cg-border) !important;
}

input-area-v2 .ql-editor {
  font-family: var(--cg-font-sans) !important;
  font-size: 16px !important;
  line-height: 1.55 !important;
  color: var(--cg-text) !important;
}
input-area-v2 .ql-editor.ql-blank::before {
  font-family: var(--cg-font-sans) !important;
  color: var(--cg-text-faint) !important;
  font-style: normal !important;
}

/* Model picker inside composer: subtle compact pill */
bard-mode-switcher button.input-area-switch {
  border-radius: 9999px !important;
  font-family: var(--cg-font-sans) !important;
  font-size: 12.5px !important;
  font-weight: 500 !important;
  color: var(--cg-text-muted) !important;
  background: var(--cg-bg-bubble) !important;
  height: 30px !important;
  padding: 0 10px !important;
}
bard-mode-switcher button.input-area-switch:hover {
  background: var(--cg-bg-hover) !important;
  color: var(--cg-text) !important;
}

/* ChatGPT iconic circular send button */
input-area-v2 .send-button-container .send-button:not([disabled]) {
  background-color: var(--cg-send-bg) !important;
  color: var(--cg-send-fg) !important;
  border-radius: 9999px !important;
}
input-area-v2 .send-button-container .send-button:not([disabled]) mat-icon,
input-area-v2 .send-button-container .send-button:not([disabled]) .send-button-icon {
  color: var(--cg-send-fg) !important;
}
input-area-v2 .send-button-container .send-button[disabled] {
  background-color: var(--cg-send-disabled-bg) !important;
  color: var(--cg-send-disabled-fg) !important;
  border-radius: 9999px !important;
}

/* Compact footer disclaimer */
hallucination-disclaimer {
  height: auto !important;
  min-height: 0 !important;
  padding: 6px 0 8px !important;
  margin-inline: auto !important;
}
hallucination-disclaimer .capabilities-disclaimer,
hallucination-disclaimer p {
  font-family: var(--cg-font-sans) !important;
  font-size: 11.5px !important;
  line-height: 1.3 !important;
  color: var(--cg-text-faint) !important;
  margin: 0 !important;
}

/* Back-to-bottom floating button */
back-to-bottom-fab button.back-to-bottom-fab {
  background-color: var(--cg-bg-elevated) !important;
  color: var(--cg-text) !important;
  border: 1px solid var(--cg-border-strong) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
}
`;

  function applyPreferences() {
    const root = document.documentElement;
    root.classList.toggle("cg-wide", localStorage.getItem(STORAGE_WIDE) === "1");
    root.classList.toggle("cg-clean-sidebar", localStorage.getItem(STORAGE_CLEAN_NAV) === "1");
  }

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = CSS;
    (document.head || document.documentElement).appendChild(style);
  }

  function buildEl(tag, opts = {}) {
    const el = document.createElement(tag);
    if (opts.className) el.className = opts.className;
    if (opts.text !== undefined) el.textContent = opts.text;
    if (opts.title) el.title = opts.title;
    if (opts.action) el.dataset.cgAction = opts.action;
    if (opts.type && el instanceof HTMLButtonElement) el.type = opts.type;
    return el;
  }

  function syncHeader(header) {
    const modelBtn = document.querySelector(
      "bard-mode-switcher button.input-area-switch, bard-mode-switcher button"
    );
    const modelText = modelBtn?.innerText?.trim().replace(/\s+/g, " ") || "";
    const tagEl = header.querySelector(".cg-model-tag");
    if (tagEl) {
      tagEl.textContent = modelText;
      tagEl.style.display = modelText ? "inline-block" : "none";
    }

    const topBar = document.querySelector("top-bar-actions");
    const topBarW = topBar ? Math.ceil(topBar.getBoundingClientRect().width) : 48;

    const chatWin = document.querySelector("chat-window");
    if (chatWin) {
      const rect = chatWin.getBoundingClientRect();
      header.style.left = `${Math.round(rect.left)}px`;
      header.style.width = `${Math.max(200, Math.round(rect.width) - topBarW - 10)}px`;
    }
    header.style.paddingRight = "10px";

    const rawTitle = document.title.replace(/\s*[-–|]\s*Google Gemini$/i, "").trim();
    const titleEl = header.querySelector(".cg-chat-title");
    if (titleEl) {
      titleEl.textContent = rawTitle && rawTitle !== "Google Gemini" && rawTitle !== "Gemini" ? rawTitle : "";
    }

    const wideBtn = header.querySelector("[data-cg-action='wide']");
    if (wideBtn) {
      const isWide = document.documentElement.classList.contains("cg-wide");
      wideBtn.classList.toggle("is-on", isWide);
      wideBtn.textContent = isWide ? "宽屏 960px" : "标准 768px";
    }

    const navBtn = header.querySelector("[data-cg-action='clean-nav']");
    if (navBtn) {
      const isClean = document.documentElement.classList.contains("cg-clean-sidebar");
      navBtn.classList.toggle("is-on", isClean);
      navBtn.textContent = isClean ? "精简侧栏: 开" : "精简侧栏";
    }
  }

  let observedTopBar = null;
  let observedChatWin = null;
  let topBarObserver = null;
  let resizeBound = false;

  function ensureHeader() {
    const chatWin = document.querySelector("chat-window");
    if (!chatWin || !document.body) return;
    let header = document.getElementById(HEADER_ID);
    if (!header) {
      header = buildEl("div");
      header.id = HEADER_ID;

      const left = buildEl("div", { className: "cg-header-left" });
      const modelBtn = buildEl("button", {
        type: "button",
        className: "cg-model-pill",
        title: "切换模型",
        action: "model",
      });
      modelBtn.appendChild(buildEl("span", { text: "Gemini" }));
      modelBtn.appendChild(buildEl("span", { className: "cg-model-tag" }));
      left.appendChild(modelBtn);
      left.appendChild(buildEl("span", { className: "cg-chat-title" }));

      const right = buildEl("div", { className: "cg-header-right" });
      right.appendChild(
        buildEl("button", {
          type: "button",
          className: "cg-hdr-btn",
          text: "标准 768px",
          title: "切换对话列宽 (768px / 960px)",
          action: "wide",
        })
      );
      right.appendChild(
        buildEl("button", {
          type: "button",
          className: "cg-hdr-btn",
          text: "精简侧栏",
          title: "隐藏侧栏多余入口 (Library/Images/Notebooks)",
          action: "clean-nav",
        })
      );

      header.appendChild(left);
      header.appendChild(right);

      header.addEventListener("click", (e) => {
        const target = e.target instanceof Element ? e.target.closest("[data-cg-action]") : null;
        if (!target) return;
        const action = target.dataset.cgAction;
        if (action === "model") {
          const switcher = document.querySelector("bard-mode-switcher button.input-area-switch");
          switcher?.click();
        } else if (action === "wide") {
          const next = localStorage.getItem(STORAGE_WIDE) === "1" ? "0" : "1";
          localStorage.setItem(STORAGE_WIDE, next);
          applyPreferences();
          syncHeader(header);
        } else if (action === "clean-nav") {
          const next = localStorage.getItem(STORAGE_CLEAN_NAV) === "1" ? "0" : "1";
          localStorage.setItem(STORAGE_CLEAN_NAV, next);
          applyPreferences();
          syncHeader(header);
        }
      });
      document.body.appendChild(header);
    }

    if (!resizeBound) {
      resizeBound = true;
      window.addEventListener("resize", () => {
        const h = document.getElementById(HEADER_ID);
        if (h) syncHeader(h);
      });
    }

    const topBar = document.querySelector("top-bar-actions");
    if ((topBar !== observedTopBar || chatWin !== observedChatWin) && typeof ResizeObserver !== "undefined") {
      observedTopBar = topBar;
      observedChatWin = chatWin;
      topBarObserver?.disconnect();
      topBarObserver = new ResizeObserver(() => {
        const h = document.getElementById(HEADER_ID);
        if (h) syncHeader(h);
      });
      if (topBar) topBarObserver.observe(topBar);
      topBarObserver.observe(chatWin);
    }

    syncHeader(header);
  }

  function boot() {
    applyPreferences();
    injectStyle();
    ensureHeader();

    let rafPending = false;
    const observer = new MutationObserver(() => {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(() => {
        rafPending = false;
        injectStyle();
        ensureHeader();
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  if (document.documentElement) {
    boot();
  } else {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  }
})();
