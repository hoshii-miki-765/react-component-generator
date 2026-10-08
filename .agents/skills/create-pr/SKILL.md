---
name: create-pr
description: Create a GitHub pull request from the current branch when the user asks to open a PR.
---

# Create Pull Request

Create a GitHub pull request for the current repository branch.

## Execution boundary

This skill must run **only in a subagent**. A parent agent must delegate the complete PR workflow to a subagent and must not create, push, or update the pull request itself. If this skill is invoked outside a subagent, stop and ask the parent to delegate it.

## Workflow

1. Confirm the repository has a configured GitHub remote, the current branch is not the default/base branch, and the branch has commits or changes to propose. Check whether an open pull request already exists for the branch; reuse its URL instead of creating a duplicate.
2. Inspect the branch diff and relevant test results. Derive a concise PR title and summary from the actual changes; do not invent behavior or verification.
3. Read [references/pr-template.md](references/pr-template.md) and choose its language section before drafting the body:
   - Use the Korean template for repositories owned by `hoshii-miki-765`.
   - Use the English template for every other open-source repository.
   Fill every applicable section and omit only sections explicitly marked optional when they do not apply.
4. Push the current branch with its upstream if needed, then create the PR against the repository default branch. Do not merge, close, or modify unrelated pull requests.
5. When running in Codex and a PR is created, attach it to the current task with the available pull-request artifact tool. Report the PR URL, base branch, head branch, and verification performed.

Stop and report the blocker if authentication, remote access, uncommitted changes requiring a user decision, or PR creation fails. Do not retry external mutations after an ambiguous result; first check whether the PR was created.
