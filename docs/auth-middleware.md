### Auth middleware (Cognito-ready scaffold)

Location: `src/middlewares/auth.ts`

Purpose

- Provide a standard place to attach authentication/authorization logic.
- Today it is a scaffold that can enforce header presence and route placement. It’s wired for future AWS Cognito JWT validation.

How it’s wired

- In `src/controllers/main_router.ts`, you can apply the middleware per-router or globally:

```ts
import {requireAuth} from '../middlewares/auth';
// router.use(requireAuth); // uncomment to protect all routes under /helios-server
router.use('/temps', temps); // example feature router
```

Environment variables

- `COGNITO_ENABLED`: when set to `true`, the middleware checks the `Authorization: Bearer <token>` header.
- `COGNITO_ENFORCE`: when set to `true`, requests without a valid token will receive 501 until verification is implemented.
- Planned for future verification:
  - `COGNITO_REGION`
  - `COGNITO_USER_POOL_ID`
  - `COGNITO_CLIENT_ID` (optional for audience validation)

Future implementation sketch

1. Fetch public JWKS from `https://cognito-idp.<region>.amazonaws.com/<userPoolId>/.well-known/jwks.json`.
2. Verify JWT signature and claims (issuer, audience, expiration) using a JWKS client (e.g., `jose` or `jwks-rsa`).
3. Attach verified claims to `req.user` for downstream handlers.

Example `.env` snippet

```
COGNITO_ENABLED=true
COGNITO_ENFORCE=false
COGNITO_REGION=us-east-1
COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
```

Applying to specific routes only

- Apply `requireAuth` selectively:

```ts
router.use('/protected', requireAuth, protectedRouter);
```

Notes

- Keep actual verification code isolated in the middleware. Routes should assume `req.user` (or similar) is present when protected.
- Add unit tests by mocking `Authorization` headers and toggling the env flags.
