# Security notes

- Passwords are hashed with bcrypt (12 rounds). Password hashes are excluded from normal Mongoose selection and profile serialization.
- Session JWTs are stored in HTTP-only cookies with seven-day expiry; production cookies are Secure and SameSite=None for separately hosted Vercel/Render origins. Use HTTPS.
- CORS allows only configured exact client origins and credentials. Mutating requests with an Origin header are checked against the same allowlist. This is an origin defense, not a complete CSRF token implementation.
- Helmet, JSON request-size limits, rate limits on authentication, claim creation, and moderation submissions are configured.
- Zod validation is applied to user-controlled request bodies; IDs are checked by Mongoose and errors are sanitized.
- Report owner, claimant, notification recipient, admin role, and status transitions are derived or checked server-side. Public listing fields do not include claim evidence.
- Account status is checked during authentication. Registration does not accept roles. Profile changes cannot change roles or verification.
- `JWT_SECRET`, database credentials, and Cloudinary keys must be server-side secrets. Never put them in Vite variables or source control.

Known gaps: no CSRF token mechanism, no image upload/file delivery implementation, no session revocation list, and no automated security test suite. Claim approval/competing-claim locking is not transactional, so concurrent review requests are a race risk. The service is not independently audited.
