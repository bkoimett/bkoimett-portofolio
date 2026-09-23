# MongoDB → Supabase migration tooling

Reads the legacy MongoDB collections and upserts them into Supabase PostgreSQL,
preserving the Mongo `_id` as the `id` primary key (so existing `/api/*/:id/view`
URLs and the frontend `_id` contract keep working).

## Files

- `transform.js` — pure, side-effect-free mappers (Mongo doc → Supabase row).
  Unit-tested against representative fixtures in `backend/tests/migration.test.js`.
- `run.js` — the runner. Connects to Mongo, transforms, upserts (idempotent),
  reports legacy `/api/images/:id` references for Phase 4 rewriting.

## Requirements

Env variables (backend `.env` or process):

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | Existing Atlas connection string |
| `SUPABASE_URL` | `https://<project>.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Service-role key (server-only) |

The target schema must already be applied: `supabase/migrations/0001_initial_schema.sql`
(plus `0002_storage.sql` for Phase 4).

## Run

```bash
cd backend
npm run migrate:dry         # check what would be written (no writes)
npm run migrate             # migrate projects + blogs + cvs + admins
npm run migrate -- --project   # single table: project | blog | cv | admin
```

Idempotent: re-running only updates rows that changed. Never deletes Mongo data.

## Scope / non-goals

- GridFS **bytes** are not copied by `run.js`. `cvs.storage_path` is reserved
  deterministically (`current/<fileId>.pdf`); the Phase 4 storage step populates
  the object bytes there. Image fields holding `/api/images/:id` are reported for
  rewriting to Supabase Storage URLs in Phase 4.
- Admin passwords are copied as their existing bcrypt hashes (never plaintext),
  and `auth_user_id` stays null until Phase 5 links Supabase Auth.

## Production run (manual)

1. Apply `supabase/migrations/*.sql` to the production Supabase project.
2. Set `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` in the environment/`.env`.
3. Run `npm run migrate` from a machine with network access to Atlas.
4. Confirm the summary counts against known production numbers before proceeding.