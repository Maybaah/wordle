# wordle

Daily word game for the [maybaah.github.io](https://maybaah.github.io/) arcade:
guess the five-letter word in six tries. One daily puzzle for everyone plus
unlimited practice. Vanilla JS, no build step, no dependencies.

**Play:** https://maybaah.github.io/wordle/

## How it fits together

This repo deploys as a project page under the root site's domain. It loads the
shared design system and arcade client (`/assets/site.css`, `/assets/arcade.js`)
from [Maybaah/Maybaah.github.io](https://github.com/Maybaah/Maybaah.github.io),
so it must be served under that domain to look and score right.

Daily wins are submitted to the arcade leaderboard Worker, which recomputes the
day's answer and checks every guess before ranking the run — the same
never-trust-the-client model as [flowcode](https://github.com/Maybaah/flowcode).
Practice runs stay local.

- Daily word: deterministic seeded shuffle over a curated answer list, indexed
  by days since 2026-01-01 (UTC).
- Any five-letter guess is accepted; the hidden word is always common.
- Local run history lives in `localStorage` and feeds the arcade hub cards.
