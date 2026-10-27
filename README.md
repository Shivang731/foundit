

## Problem and goals

Campus reports are scattered across chats and notice boards. FoundIt puts those reports into a searchable community space. Its core workflow keeps public descriptions separate from private ownership evidence and records claim approval separately from physical handover.

## Features

- Email and password registration, login, logout, and seven-day HTTP-only cookie sessions.
- Lost and found reports with category, date, location, description, and optional photos.
- Search, type/category/location/status filters, sorting, pagination, and item detail pages.
- Report owner edit and close permissions.
- Private claims on open found reports, owner review, request for information, rejection reason, and separate return confirmation.
- Deterministic potential matches for lost items using category, title keywords, location, and date proximity, with reasons shown.
- Database-backed notifications, profile, activity, moderation report intake, and administrator overview.
- Responsive, keyboard-friendly interface with empty, loading, and error states.

## Technology and architecture

React 18, Vite, React Router, TanStack Query, Axios, Lucide, and custom responsive CSS. The Express 4 API uses Mongoose, MongoDB, Zod validation, bcrypt, JWTs held only in HTTP-only cookies, Helmet, CORS, and rate limits. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

```text
foundit/
  client/       React application
  server/       Express API, Mongoose models, and development seed
  docs/         Architecture, API, and security notes
```

## Screenshots

Screenshots will be added after capture from a running installation. No screenshots are included yet.

## Data model

Collections: User, Item, Claim, Notification, and ModerationReport. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#data-model).

## Local setup

Requirements: Node.js 20+, npm, and MongoDB 6+ running locally or an Atlas connection string.

```bash
cd foundit
cp server/.env.example server/.env
cp client/.env.example client/.env
npm install
```

Set a unique, long `JWT_SECRET` in `server/.env` and check `MONGODB_URI` and `CLIENT_URL`. The API defaults to port 4000 and Vite to 5173.

```bash
npm run seed       # optional development-only fictional records
npm run dev        # API and frontend together
```

Open http://localhost:5173. Seed accounts share the development-only password `FoundItDemo2026!`: `aarav.demo@foundit.test`, `mira.demo@foundit.test`, and `kabir.demo@foundit.test`. Never use these accounts or password in production. The seed script upserts fictional records only when invoked manually.

## Environment variables

Backend variables are documented in `server/.env.example`: `NODE_ENV`, `PORT`, `MONGODB_URI` (the `MONGO_URI` alias is accepted), `JWT_SECRET`, `CLIENT_URL` (comma-separated exact origins supported), `COOKIE_DOMAIN`, `ALLOWED_EMAIL_DOMAIN`, and Cloudinary credentials. Email-domain restrictions are off unless configured. Frontend uses `VITE_API_URL` from `client/.env.example`.

Cloudinary variables are placeholders for a later upload integration; photo attachment is not implemented in this release. Reports without images are fully supported. The UI discloses that photos require server configuration.

## Commands and checks

- `npm run dev` — run both services
- `npm run seed` — insert or refresh development demo records
- `npm run build` — production build of the React client
- `npm start` — start the API after setting backend environment variables

There is no automated test suite in this release. Do not interpret a successful build as proof that MongoDB workflows have been integration-tested. The API health endpoint is `GET /api/health`; its database field reflects the active Mongoose connection.

## API

The documented endpoints and permissions are in [docs/API.md](docs/API.md).

## Ownership verification

The report description is public. Claim explanation and optional textual evidence are only returned to the claimant, report owner, or administrator. Claimants should include a non-public identifying detail and avoid posting passwords, payment information, or unnecessary personal data. The server does not automatically approve based on public metadata. A report owner can approve, reject with a reason, or ask for more information. Approval does not mean an item has physically changed hands; the owner must separately confirm return. Approval locks other pending claims into review so they cannot also be approved through the normal owner flow.

## Deployment

1. Create MongoDB Atlas database and restrict network access to the Render service.
2. Deploy `server/` as a Render Node web service. Set `NODE_ENV=production`, `PORT` (Render provides it), `MONGODB_URI`, a long random `JWT_SECRET`, and `CLIENT_URL` to the exact HTTPS Vercel origin. Cross-site cookies use `SameSite=None; Secure`; keep HTTPS enabled.
3. Deploy `client/` to Vercel with root directory `client` and `VITE_API_URL=https://<your-render-host>/api`. Add an SPA rewrite to `/index.html` if route refreshes need it.
4. Configure the Render health check path as `/api/health`. Verify that its database value is `connected`.
5. Configure Cloudinary only after an upload endpoint is implemented. Credentials are server-side only.
6. Bootstrap the first administrator securely: create a normal account, then use an authenticated, one-off local maintenance script or direct controlled database operation to change that user's `role` to `admin`. Do not expose an unauthenticated setup endpoint or commit a preset admin password. This repo does not include an admin bootstrap script yet.

No deployment was performed; hosting credentials and Atlas configuration were not provided.

## Security

See [docs/SECURITY.md](docs/SECURITY.md). In particular, secure cookies and request-origin checks apply; use HTTPS in production and set exact origins. The app has authentication and moderation-report limits and validates IDs, fields, and ownership on the server. Private evidence currently supports text only. This initial release has no CSRF token mechanism, no Cloudinary integration, and no upload route.

## Known limitations

- Image upload and private file delivery are not implemented.
- No test suite, email delivery, real-time updates, or map UI.
- Admin report overview, moderation intake/review, user listing/status, and item status APIs exist; the UI currently provides overview and recent reports only, not full moderation controls.
- Account suspensions are checked at authentication time but do not revoke already-issued cookies until the session is refreshed.
- MongoDB transactions are not used. Claim approval and locking competing claims are separate writes; review and operational monitoring are needed for concurrent approvals.
- `identifyingDetails` is stored privately and omitted from public reads and write responses. An owner-only retrieval/editing experience for that field is not yet implemented.
- This is a demonstrable MVP and has not had an external security audit.

## Future improvements

Cloudinary uploads with validated MIME and size, private evidence storage, CSRF token defense, tests for business rules, moderation controls, transactional claim locking on replica-set MongoDB, email notifications, account session revocation, and accessibility review.

## License

No license has been selected.
