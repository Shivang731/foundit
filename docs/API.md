# API reference

Base path: `/api`. JSON errors use `{ "error": "…" }`. Authenticated endpoints use the HTTP-only session cookie. Listing endpoints use `page`, `limit` (maximum 48), `q`, `type`, `category`, `location`, `status`, and `sort` where applicable.

## Health and authentication

- `GET /health` — API and database status.
- `POST /auth/register` — name, email, password, optional campus; returns user and cookie.
- `POST /auth/login` — email and password; returns user and cookie.
- `POST /auth/logout` — clears session cookie.
- `GET /auth/me` — current user.

## Items

- `GET /items` — filtered/paginated reports. `status=all` includes resolved/closed records.
- `GET /items/:id` — public report and public owner display information.
- `POST /items` — authenticated create; owner is derived from session.
- `PATCH /items/:id` — owner/admin edit.
- `DELETE /items/:id` — owner/admin close (soft close).
- `GET /items/:id/matches` — deterministic suggestions for a lost report.
- `POST /items/:id/recovery-leads` — authenticated private notification to a lost report owner.
- `POST /items/:id/claims` — authenticated private ownership claim for an open found report.
- `POST /items/:id/confirm-return` — owner/admin resolves an open found report with an approved claim.

## Claims

- `GET /claims/submitted` — current user's claims.
- `GET /claims/received` — claims on the current user's reports.
- `GET /claims/:id` — claimant, report owner, or admin only; private evidence included.
- `PATCH /claims/:id/status` — owner/admin: `under_review`, `approved`, or `rejected`; rejection requires a reason.
- `POST /claims/:id/request-information` — owner/admin asks claimant for more information.
- `POST /claims/:id/withdraw` — claimant withdraws a pending or under-review claim.

## Other endpoints

- `GET /notifications`, `PATCH /notifications/:id/read`, `PATCH /notifications/read-all` — recipient-scoped notifications.
- `GET /users/me`, `PATCH /users/me` — profile; role and account state cannot be changed here.
- `POST /moderation/reports` — authenticated abuse report; duplicate pending submissions are rejected.
- `GET /admin/overview`, `/admin/items`, `/admin/moderation-reports`, `/admin/users` — admin only.
- `PATCH /admin/moderation-reports/:id`, `/admin/items/:id/status`, `/admin/users/:id/status` — admin only.

The implementation and response details should be treated as the source of truth. No upload API is present yet.
