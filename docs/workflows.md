### GitHub Actions Workflows

This repository can include the following workflows under `.github/workflows/`. If some are currently removed, you can restore them from history as needed.

1. CI (build-lint-test)

- Installs dependencies, runs Prisma generate, lints, checks formatting, builds, and runs tests with coverage.
- Typical triggers: push/PR to any branch.

2. FORMAT [helios-server action]

- Runs Prettier check and ESLint on `dev` and `main` branches and on PRs targeting them.
- Ensures code style and lint rules are followed.

3. TEST ALL [helios-server action]

- Runs the full Jest suite with `NODE_ENV=test` and sets `TEST_USER_ID`.
- In the current setup, it’s manual-only (`workflow_dispatch`) so it won’t run on push/PR unless re-enabled.

4. Docker Build and Push

- Builds a multi-arch Docker image and pushes to Docker Hub.
- Requires repo secrets: `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`.
- Triggered on push to `main`/`dev` or manually.

5. Release on Tag

- Builds the project and creates a GitHub Release for tags like `vX.Y.Z`.
- Uses `softprops/action-gh-release` to generate release notes.

6. CodeQL

- Performs static code analysis for JavaScript/TypeScript.
- Triggered on push/PR to `main`/`dev` and on a weekly schedule.

7. Prisma Schema Validate

- Runs `prisma validate` when Prisma files change in a PR to ensure the schema is valid.

Enabling/disabling

- To disable a workflow, remove its event triggers (keep `workflow_dispatch` for manual runs).
- To re-enable, add `push`/`pull_request` triggers per your branching strategy.
