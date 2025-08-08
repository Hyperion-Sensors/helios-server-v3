### Adding a new route

This project mounts all API routes under `/helios-server` via `index.ts` → `src/controllers/main_router.ts`.

High-level structure:

- `index.ts` initializes the Express app and mounts `main_router` at `/helios-server`.
- `src/controllers/main_router.ts` composes feature routers, e.g. `router.use('/temps', temps)`.
- Feature routers live under `src/routes/**` and call service functions in `src/services/**`.

Steps to add a route

1. Create a router file (or use an existing feature router)

Example: add `GET /helios-server/example/ping`

Create `src/routes/example.ts`:

```ts
import express, {Request, Response, Router} from 'express';
const router: Router = express.Router();

router.get('/ping', async (_req: Request, res: Response) => {
	res.json({ok: true});
});

export default router;
```

2. Register the router in `src/controllers/main_router.ts`

```ts
import example from '../routes/example';
// ...
router.use('/example', example);
```

3. If business logic or DB access is needed, add a service function under `src/services/<feature>/...`

For example, create `src/services/example_services/index.ts` and call it from your route.

4. Build and run

```
yarn build && yarn start
```

The new endpoint will be available at `/helios-server/example/ping`.

Notes

- Keep DB access inside services. Consider using shared Prisma client in `src/lib/prisma.ts`.
- Add unit tests under `test/unit` using `supertest` for HTTP routes.
