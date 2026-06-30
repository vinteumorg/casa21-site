# Casa21 Site

Casa21 is a community space in São Paulo for learning, hacking, and building on Bitcoin. This repository contains the public Casa21 website, built with Next.js.

Production site:

- https://casa21.vinteum.org

Repository:

- https://github.com/vinteumorg/casa21-site

## Tech stack

- [Next.js](https://nextjs.org/) 16, App Router
- React 19
- TypeScript
- Tailwind CSS 4
- pnpm
- systemd-based production deployment on the Casa21 VM

## Local development

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

Open:

```txt
http://localhost:3000
```

Build for production:

```bash
pnpm build
```

Start a production server locally:

```bash
pnpm start
```

Run linting:

```bash
pnpm lint
```

## Project structure

```txt
app/                     Next.js App Router routes and layout
app/api/events/          Evento.so events API proxy
app/api/newsletter/      Ghost newsletter subscription endpoint
app/api/deploy/          GitHub webhook deploy endpoint
components/              React UI components
components/layout/       Navbar and Footer
components/sections/     Homepage sections
constants/               Shared constants
data/                    Static content and navigation data
hooks/                   React hooks
lib/                     Shared utilities and service clients
public/                  Static assets
types/                   Shared TypeScript types
scripts/deploy-main.sh   Production deploy script
```

## Environment variables

Create a local environment file when needed:

```bash
cp .env.example .env.local
```

Supported variables include:

```txt
EVENTO_SO_API_KEY=...
EVENTO_SO_USERNAME=casa21
GHOST_URL=...
GHOST_ADMIN_API_KEY=...
GITHUB_WEBHOOK_SECRET=...
```

Notes:

- `.env.local` is intentionally ignored by git.
- `GITHUB_WEBHOOK_SECRET` is required only on the production VM for webhook autodeploy.
- Ghost variables are used by the newsletter integration.
- Evento.so variables are used by the events integration.

## Production deployment

The production VM runs the site through systemd:

```txt
casa21.service
```

The service starts Next.js on port `8000`:

```bash
next start -H 0.0.0.0 -p 8000
```

Useful commands on the VM:

```bash
sudo systemctl status casa21.service --no-pager -l
sudo systemctl restart casa21.service
journalctl -u casa21.service -f
```

Manual deploy from the VM:

```bash
scripts/deploy-main.sh
```

The deploy script:

1. Locks with `flock` to avoid overlapping deploys.
2. Fetches `origin/main`.
3. Resets the working tree to `origin/main`.
4. Installs dependencies with `pnpm install --frozen-lockfile`.
5. Builds with `pnpm build`.
6. Restarts `casa21.service`.
7. Writes logs to `/home/exedev/casa21-deploy.log`.

## GitHub webhook autodeploy

Pushes to `main` can automatically deploy the site through the webhook endpoint:

```txt
POST https://casa21.vinteum.org/api/deploy
```

GitHub webhook settings:

```txt
Payload URL: https://casa21.vinteum.org/api/deploy
Content type: application/json
Events: Just the push event
Secret: same value as GITHUB_WEBHOOK_SECRET on the VM
Active: yes
```

The deploy endpoint verifies GitHub's `X-Hub-Signature-256` HMAC signature. It only deploys when all of these are true:

- event is `push`
- ref is `refs/heads/main`
- the branch was not deleted
- the signature matches `GITHUB_WEBHOOK_SECRET`

Health check:

```bash
curl https://casa21.vinteum.org/api/deploy
```

Expected response:

```json
{ "ok": true, "route": "deploy" }
```

## Content integrations

### Events

Events are fetched from Evento.so via:

```txt
app/api/events/route.ts
```

The route expects `EVENTO_SO_API_KEY` and optionally `EVENTO_SO_USERNAME`.

### Newsletter

Newsletter subscriptions are handled through Ghost Admin API via:

```txt
app/api/newsletter/subscribe/route.ts
```

The route expects `GHOST_URL` and `GHOST_ADMIN_API_KEY`.

## Contributing

Use short, descriptive commits. Before pushing, run:

```bash
pnpm build
```

If possible, also run:

```bash
pnpm lint
```

Push changes to `main` only when they are ready to deploy.
