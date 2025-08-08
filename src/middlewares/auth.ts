import {Request, Response, NextFunction} from 'express';

/*
Example auth middleware placement for future AWS Cognito token verification.

Behavior:
- If COGNITO_ENABLED !== 'true', this is a no-op (allows all requests).
- If enabled and Authorization header missing or malformed, returns 401.
- If enabled and COGNITO_ENFORCE === 'true', this currently returns 501 until
  the Cognito JWT verification is implemented (see docs/auth-middleware.md).
- Otherwise (enabled but not enforcing), it passes through after basic checks.
*/

export function requireAuth(req: Request, res: Response, next: NextFunction) {
	const isEnabled = process.env.COGNITO_ENABLED === 'true';
	const isEnforce = process.env.COGNITO_ENFORCE === 'true';

	if (!isEnabled) {
		next();
		return;
	}

	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		res.status(401).json({error: 'Missing or invalid Authorization header'});
		return;
	}

	const token = authHeader.slice('Bearer '.length).trim();
	// Attach raw token for downstream use. Verification will be added later.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(req as any).accessToken = token;

	if (isEnforce) {
		res.status(501).json({error: 'Cognito verification not implemented yet'});
		return;
	}

	next();
}
