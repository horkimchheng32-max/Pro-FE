# Sporty

Next.js (App Router, JavaScript) front end for https://sport-api.eunglyzhia.com/api/v1

## Run
```bash
npm install
cp .env.example .env.local   # already included
npm run dev                  # http://localhost:3000
```

## Env
- `NEXT_PUBLIC_API_URL` - API base URL (Next.js equivalent of `VITE_API_URL`).
- `NEXT_PUBLIC_USE_PROXY=true` - route browser calls via `/api-proxy` (Next rewrite) if you hit CORS errors.
- `NEXT_PUBLIC_ENABLE_FAVORITE_WRITE=true` - enable favorite POST/DELETE once the deployed server supports them.

## Structure
`src/api/*` all HTTP calls (no fetch inside components) - `src/hooks/useFetch.js` - `src/components/*` - `src/app/*` routes - `src/utils/normalize.js` response-shape helpers.

## Routes
`/` `/sports` `/sports/[uuid]` `/events` `/events/[uuid]` `/categories` `/favorites` `/admin`
# Pro-FE
