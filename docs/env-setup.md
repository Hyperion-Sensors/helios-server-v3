### Environment setup (.env)

The server loads environment variables using `dotenv` in `index.ts` and uses Prisma for DB access. Below variables are referenced in code:

Required
- `PORT`: Port for the Express server (e.g., `8000`).
- `DATABASE_URL`: Postgres connection string for Prisma, e.g.: `postgresql://user:password@host:5432/dbname`.

Optional (used by tests or integrations)
- `NODE_ENV`: `development` | `test` | `production`. When `NODE_ENV=test`, the app does not bind the port.
- `TEST_USER_ID`: UUID used by settings route tests.
- AWS (if using file services to S3):
  - `AWS_REGION`
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`
  - `AWS_S3_BUCKET_NAME`

Example .env (local dev)
```
PORT=8000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/helios

# Optional for tests
TEST_USER_ID=0e0812d1-b165-45f6-bcdb-6fa312392861

# Optional for S3 integration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=YOUR_KEY
AWS_SECRET_ACCESS_KEY=YOUR_SECRET
AWS_S3_BUCKET_NAME=your-bucket
```

How it’s used
- `index.ts` reads `PORT` and `NODE_ENV`.
- `prisma/schema.prisma` uses `DATABASE_URL` to connect to Postgres.
- `src/services/file_services/index.ts` reads AWS variables for S3 operations.
- tests in `test/unit/routes/settings_routes.test.ts` read `TEST_USER_ID` for requests.

