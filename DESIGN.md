---
name: rndyt TUI Reading Session
description: A terminal-first reading workspace for inspectable engineering judgment.
colors:
  canvas: "#0B0F14"
  surface: "#10161E"
  surface-raised: "#141C26"
  surface-active: "#1A2632"
  line: "#293644"
  line-strong: "#45586C"
  text: "#E8EDF2"
  text-soft: "#B8C3CE"
  dim: "#7D8D9C"
  green: "#D7FF6A"
  cyan: "#7BDFF2"
  amber: "#FFCB6B"
  red: "#FF7B72"
  blue: "#79C0FF"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Text, PingFang SC, sans-serif"
    fontSize: "clamp(2.35rem, 5.2vw, 4.8rem)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.04em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Text, PingFang SC, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.9
  label:
    fontFamily: "SFMono-Regular, SF Mono, Menlo, Consolas, monospace"
    fontSize: ".7rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "normal"
rounded:
  none: "0px"
  dot: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  nav-link:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.dim}"
    rounded: "{rounded.none}"
    padding: "4px 9px"
  pane:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.none}"
    padding: "16px"
  tag:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.dim}"
    rounded: "{rounded.none}"
    padding: "1px 6px"

# Design System: rndyt TUI Reading Session

## Overview

**Creative North Star: "A tmux reading desk for engineering judgment."**

The site is a working terminal session, not a terminal costume. Readers enter a path, see a command-like prompt, inspect stdout-like summaries, and open a deeper pane for Blog, AI, or Project. The dark buffer is quiet enough for long Chinese text; fixed-width labels, pane borders, ANSI accents, and a single block cursor carry the computer-terminal character.

The interface stays flat and explicit. Content remains the primary artifact, while terminal syntax provides orientation, state, and a memorable reading gesture. Pixel character comes from character cells, inverse selection, and discrete state changes rather than hardware-display nostalgia, game scores, or decorative scanlines.

**Key Characteristics:**
- Dark terminal buffer with 1px structural borders.
- SF Mono for paths, commands, metadata, and state; system UI fonts for readable Chinese body copy.
- Three-pane TUI composition on wide screens; directory, output, and status stack on small screens.
- ANSI green/cyan/amber accents are sparse and semantic.

## Colors

The palette is a near-black working surface with pale text and a small ANSI accent set. Accents identify state and navigation; they do not fill whole panels.

### Primary
- **Cursor Green** (#D7FF6A): prompts, active tabs, verified status, and the one block-cursor moment.
- **Terminal Cyan** (#7BDFF2): paths, links, and navigational output.

### Secondary
- **Process Amber** (#FFCB6B): preview warnings, role labels, and process metadata.
- **Signal Red** (#FF7B72): window-state dot and reserved error emphasis.
- **Reference Blue** (#79C0FF): optional secondary link/status emphasis.

### Neutral
- **Canvas** (#0B0F14): page background.
- **Surface** (#10161E): terminal panes and article headers.
- **Raised Surface** (#141C26): chrome bars, command bars, and active controls.
- **Active Surface** (#1A2632): hover and selected row state.
- **Line** (#293644) and **Strong Line** (#45586C): pane and output boundaries.
- **Text** (#E8EDF2), **Soft Text** (#B8C3CE), **Dim Text** (#7D8D9C): readable hierarchy; dim text still clears normal-size contrast.

### Named Rules
**The ANSI Rarity Rule.** Green, cyan, amber, red, and blue identify state or affordance; they do not become decorative gradients or full-screen washes.

## Typography

**Display Font:** SF Pro Text / system UI (with PingFang SC fallbacks)
**Body Font:** system UI (with PingFang SC and Hiragino Sans GB fallbacks)
**Label/Mono Font:** SFMono-Regular / SF Mono (with Menlo and Consolas fallbacks)

**Character:** System UI fonts keep Chinese paragraphs calm and legible. SF Mono is reserved for paths, commands, metadata, tab labels, and measured values so terminal language carries real information.

### Hierarchy
- **Display** (600, `clamp(2.35rem, 5.2vw, 4.8rem)`, 1.02): identity and first-viewport thesis.
- **Headline** (600, `clamp(2.2rem, 5vw, 4.1rem)`, 1.02): section and article introductions.
- **Title** (500, 1rem-1.1rem, 1.4): output row and project titles.
- **Body** (400, 1rem, 1.9, max 72ch): article content and explanations.
- **Label** (400, .63rem-.76rem, 1.4): paths, prompts, metadata, statuses, and tags in SF Mono.

### Named Rules
**The Command/Content Rule.** Mono labels orient the reader; prose never gets compressed into terminal shorthand just to perform the metaphor.

## Layout

The page container is `min(1200px, 100% - 48px)` on desktop and `100% - 32px` on small screens. The homepage first viewport uses a three-column workspace: directory tree, stdout thesis, and session status. At `max-width: 900px`, status becomes a full-width row; at `max-width: 700px`, all panes stack in reading order: directory, output, status.

Index pages use a two-column workspace with a directory rail and output list, collapsing to one column below 700px. Article bodies are limited to 72ch. Tight groups use 4-8px gaps; panes use 16-24px padding; sections gain more space above headings than below them.

## Elevation & Depth

The system uses tonal layering and borders, not shadows. `--surface`, `--surface-raised`, and `--surface-active` establish the terminal's depth, while 1px lines show actual pane boundaries. Hover and focus change background or border color; no colored halo or hard-offset shadow is used.

### Named Rules
**The Flat Buffer Rule.** A surface is flat at rest. Depth must explain a terminal relationship such as chrome, pane separation, active output, or focus.

## Shapes

Terminal containers, rows, tags, and controls use square corners (`0px`). The only rounded shape is the 6-8px status/window dot. Borders are 1px and structural. Selection uses an inverse/active surface rather than a pill or floating card.

## Components

### Navigation
- **Style:** SF Mono links prefixed visually with `cd `.
- **Default:** muted text, transparent border.
- **Active / hover:** green active text or soft surface background with a 1px line.
- **Mobile:** horizontal scrolling nav remains a native link row.

### Panes
- **Style:** square terminal surfaces with 1px lines and a `# label` or path label.
- **Signature:** directory trees use `|--` text prefixes; output panes use `$ command` prompts; status panes use `> key` labels.
- **Responsive:** borders become horizontal separators when panes stack.

### Content Rows
- **Style:** full-width output rows with metadata, readable title/summary, tags, and `$ ->` read affordance.
- **State:** hover uses `surface-active`; links turn green/cyan according to action.
- **Constraint:** rows are the index pattern; repeated card walls are not used for Blog or Project.

### Replay Tabs
- **Style:** a terminal process header, keyboard-navigable tab strip, one visible stdout panel.
- **State:** active tab uses green text, active background, and a 2px bottom rule; hidden panels are removed from visual flow.
- **Accessibility:** tabs reference panels through `aria-controls` / `aria-labelledby`; arrows, Home, and End move focus and selection.

### Preview Banner
- **Style:** amber bordered output line beginning `$ printenv SITE_MODE=preview`.
- **Purpose:** explicit example-content and noindex state; never hidden behind the terminal metaphor.

## Do's and Don'ts

### Do:
- **Do** make paths, commands, state, and output labels functional or explanatory.
- **Do** keep Chinese copy in readable system-font paragraphs with a 65-75ch measure.
- **Do** use the same pane grammar across homepage, indexes, articles, and replay.
- **Do** keep focus, selection, and reduced-motion states visible.

### Don't:
- **Don't** use Teletext, seven-segment, arcade score, or hardware-dashboard metaphors as the primary structure.
- **Don't** turn every title into fake shell jargon or hide the underlying link.
- **Don't** use gradients, scanline overlays, decorative glow, or rounded card stacks.
- **Don't** use progress bars, skill percentages, or recruiting claims in place of inspectable work.
