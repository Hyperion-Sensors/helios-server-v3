### Helios Server (Express + TypeScript)

Express + TypeScript REST API for Helios.

### Quick start

1) Install dependencies

```
yarn install
```

2) Create a .env (see docs/env-setup.md for all variables). Minimal example:

```
PORT=8000
DATABASE_URL=postgresql://user:password@localhost:5432/helios
```

3) Build and run

```
yarn build && yarn start
```

Or in dev (auto-reload):

```
yarn dev
```

The API mounts under `/helios-server`.

### Tests

Tests run against compiled JS in `dist`.

```
yarn test
```

Optional env for certain route tests:

```
TEST_USER_ID=<uuid>
```

### Docs

- Adding routes: `docs/adding-routes.md`
- Environment setup: `docs/env-setup.md`
- CI/CD workflows: `docs/workflows.md`

### Contributing

- Write concise, clear commit messages
- Prefer tests with new changes
- Peer review before merging
