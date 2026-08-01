---
description: Stage all changes, commit with an auto-generated message, and push to GitHub.
agent: build
---

Run `git add -A` to stage all working tree changes. Inspect `git status` and
`git diff --cached` to understand the changes, then write a concise,
conventional-style commit message (e.g. `feat:`, `fix:`, `chore:`, `docs:`)
that accurately describes them. Commit with `git commit -m "<message>"`.

Finally, push the current branch to its upstream with `git push` (if no
upstream is set, use `git push -u origin <branch>` first). Report the commit
hash and the push result.
