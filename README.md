# CI Auto-Merge Workflow

This repository contains a GitHub Actions workflow that automatically merges pull requests into `main` when the workflow runs successfully.

The workflow is in [.github/workflows/ci-automerge.yml](.github/workflows/ci-automerge.yml).

## What the workflow does

When a pull request targets `main`, the workflow runs on GitHub Actions and:

1. Checks out the repository so the runner has a `.git` directory.
2. Uses the GitHub CLI command `gh pr merge`.
3. Enables auto-merge for that pull request with the `--auto --merge` flags.

The checkout step is important because `gh pr merge` expects git context in the working directory. Without `actions/checkout`, the runner can fail with:

```text
fatal: not a git repository (or any of the parent directories): .git
```

## Workflow file explained

Current workflow behavior:

```yaml
name: CI

on:
  pull_request:
    branches:
      - main

permissions:
  contents: write
  pull-requests: write

jobs:
  auto-merge:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Auto-merge PR on success
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: gh pr merge ${{ github.event.pull_request.number }} --auto --merge
```

### Step-by-step

- `on.pull_request.branches: [main]` means the workflow runs only for PRs opened against `main`.
- `permissions.contents: write` allows the workflow token to update repository content.
- `permissions.pull-requests: write` allows the workflow to interact with pull requests.
- `actions/checkout@v4` creates the git working directory on the runner.
- `GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}` gives the GitHub CLI an authenticated token.
- `gh pr merge ... --auto --merge` turns on auto-merge using a merge commit strategy.

## What GitHub Actions is

GitHub Actions is GitHub's built-in automation system. It lets you run jobs when events happen in your repository, such as:

- opening a pull request
- pushing code
- creating a release
- tagging a commit

A GitHub Actions workflow is defined in a YAML file under `.github/workflows/`.

A workflow usually has:

- an event trigger
- one or more jobs
- steps inside each job
- permissions and secrets
- optional services like databases or Redis

## How to set this up in a new repository

1. Create a new repo on GitHub.
2. Add a file at `.github/workflows/ci-automerge.yml`.
3. Paste the workflow contents from this repository.
4. Make sure the repository allows GitHub Actions to run.
5. Ensure the default branch is `main`, or update the branch name in the workflow.
6. Open a pull request into `main` to trigger the workflow.

## Required repository settings

For this workflow to work correctly, the repository should have:

- GitHub Actions enabled
- `GITHUB_TOKEN` permissions that allow pull request and content updates
- A branch named `main`
- Merge permissions that allow the action to merge PRs

If branch protection is enabled, make sure the rules do not block the merge action unnecessarily.

## How to test it

1. Create a feature branch.
2. Make a small change, such as adding a test file.
3. Push the branch to GitHub.
4. Open a PR into `main`.
5. Watch the Actions tab for the workflow run.
6. If everything is configured correctly, the PR will be marked for auto-merge.

## Notes

- This workflow is intentionally minimal and does not run lint, tests, or build steps.
- If you want validation before merging, add those steps before the `gh pr merge` step.
- If you want the PR to merge immediately instead of enabling auto-merge, replace `--auto --merge` with a direct merge command.

## Useful files

- [.github/workflows/ci-automerge.yml](.github/workflows/ci-automerge.yml)
- [auto-merge-test.txt](auto-merge-test.txt)
- [testfile.txt](testfile.txt)
