# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro 7 with TypeScript, statically generated from repository Markdown content collections.

## Users

The primary users are Chinese-speaking technical peers and developers who want to understand `rndyt`'s engineering work and reasoning. Technical interviewers are a natural secondary audience, but the site is not designed as a recruiting landing page.

## Product Purpose

The site is `rndyt`'s durable personal technical homepage. It publishes engineering writing, AI-native workflow experiments, and project case studies so readers can inspect how problems are defined, decisions are made, constraints are handled, and results are verified.

Success means the body of work communicates a coherent technical identity and makes the owner's engineering judgment understandable without relying on resume-style claims.

## Positioning

The site connects technical ideas to inspectable reasoning and evidence. AI content focuses on how AI participates in a complete engineering workflow, including human judgment and verification, rather than presenting a prompt collection, model-call showcase, or generic tool directory.

## Operating Context

- `Blog` is the main reading entry and contains general engineering articles and conclusion-bearing short notes.
- `AI` is a dedicated workspace for AI-native thinking, experiments, and article-attached demos or deterministic workflow replays.
- `Project` contains complete personal or internship project cases organized around context, responsibility, technical decisions, outcomes, and reflection.
- Every item has one primary section and may be discovered through cross-section relationships without duplicating the content.
- Topic series provide ordered reading paths across Blog and AI while every article keeps its original primary section and URL.
- Content is written and reviewed as Markdown in the repository.

## Capabilities and Constraints

- The public site identity is always `rndyt`; real names must not appear in body copy, metadata, or copyright text.
- The site is Chinese-first for mainland Chinese readers, while established technical terminology may remain in English.
- Public contact options are limited to an email address and GitHub.
- Skills must be connected to supporting articles or projects, never represented by percentages, progress bars, or unsupported proficiency claims.
- Demos and workflow replays support an article's argument and do not need to behave like standalone products.
- Preview builds must visibly identify example content and use `noindex` until every public claim and case study has been replaced with real material.
- Company names, systems, responsibilities, and outcomes may be used in real internship cases when publishable, but company source code must not be linked.

## Brand Commitments

- Name: `rndyt`.
- Voice: technically precise, reflective, direct, and free of conspicuous recruiting language.
- The site presents a personal engineering identity rather than a separate product brand.
- Content should foreground concrete thinking and trade-offs instead of marketing slogans or keyword walls.

## Evidence on Hand

- The repository currently contains seven clearly marked preview entries covering Blog, AI, and Project, including one deterministic workflow replay.
- These entries validate the content model and interaction structure only. They are not real experience, results, endorsements, or publishable evidence and must not be presented as such.
- The product vocabulary and agreed content boundaries are recorded in `CONTEXT.md`.
- Architecture decisions for repository Markdown, the static workflow replay, and Astro are recorded in `docs/adr/`.

## Product Principles

1. Show the reasoning behind the work, not only the tools used.
2. Connect technical claims to projects, writing, demos, or other inspectable evidence.
3. Keep AI inside a human-owned engineering loop with explicit constraints and verification.
4. Prefer a focused, maintainable publishing system over product-like complexity.
5. Make recruiting value an outcome of credible work, never the site's primary tone.
