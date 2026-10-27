# Architecture

FoundIt is a two-workspace MERN application. `client/` is a Vite single-page React app. `server/` is an Express API and connects to MongoDB through Mongoose. The browser sends credentials with requests; JWT session values are held in HTTP-only cookies and are not stored in browser storage.

## Request flow

React pages use TanStack Query and a single Axios client. Express applies Helmet, exact-origin CORS, JSON size limits, cookie parsing, and mutation origin checks before route handlers. Route handlers validate request bodies with Zod and apply authentication, role, ownership, and state checks before persistence. A central error handler avoids returning server details.

## Data model

- **User**: normalized unique email, bcrypt hash (not selected by default), role, campus, active/suspended status, timestamps.
- **Item**: public report fields, lost/found type, owner, status, event date, optional image metadata, timestamps. Private identifying details are excluded from ordinary reads. Indexes cover listing filters, owner/date, and text search.
- **Claim**: item and claimant, private explanation/evidence, workflow status, reviewer, reason, and review history. Duplicate active claims are checked in application logic.
- **Notification**: recipient, actual event, optional item/claim links, read status.
- **ModerationReport**: reporter, target, reason, status, reviewer, resolution.

## Core workflow

Reports are created open by the authenticated owner. Only that owner or an admin can edit or close. Claims are accepted only on open found reports, and self-claims are rejected. The owner can request more information, approve, or reject with a reason. Approval is not a return; a separate owner action resolves the found report after an approved claim exists. A simple deterministic match score uses a baseline of 35 points, up to 30 points for matching title words, 20 for shared location tokens, and 15 (or 8) for dates within 14 (or 30) days. Candidates are limited to same-category open found reports and reasons are returned with each score.

## Running

See the repository README for setup and deployment. `GET /api/health` reports the connection state. Demo seed data is only inserted when `npm run seed` is explicitly invoked.
