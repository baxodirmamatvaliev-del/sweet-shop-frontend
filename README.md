# Sweet Shop Frontend

Customer-facing web application for browsing Sweet Shop products, managing a
basket, placing orders, and tracking order history.

## Features

- Member signup, login, profile editing, and protected routes
- Product catalog and birthday cake sections
- Persistent basket and checkout flow
- Member order history and pending-order cancellation
- Responsive layouts for desktop, tablet, and mobile

## Development

Create a `.env` file:

```env
REACT_APP_API_URL=http://localhost:3003
```

Install dependencies and start the development server:

```bash
yarn install
yarn dev
```

## Quality checks

```bash
yarn lint
yarn build
```

## VPS deployment

The production Compose file runs the frontend at `http://VPS_PUBLIC_IP:8080/`
and the backend only inside its Docker network. The existing site on ports
80 and 443 is unaffected. Put `sweet-shop-frontend` and `sweet-shop-backend`
side by side on the VPS. The backend needs its own `.env` with `PORT=3003`,
`MONGO_URL`, and `JWT_SECRET`; do not commit that file. Ensure the MongoDB
server allows connections from the VPS before starting the stack.

The current deployment defaults `CLIENT_URLS` to `http://72.60.42.107:8080`.
Set `CLIENT_URLS` in the shell before running Compose when the public IP or
domain changes. The admin panel is available at `/admin/login`; `/admin`
redirects there automatically.

Copy `deploy/backend.dockerignore` to
`../sweet-shop-backend/.dockerignore`, then run from this directory:

```bash
docker compose -f compose.prod.yml config --quiet
docker compose -f compose.prod.yml up -d --build
docker compose -f compose.prod.yml ps
curl -I http://127.0.0.1:8080/
curl -i http://127.0.0.1:8080/api/
```

The backend's `public/uploads` directory is mounted from the host so new
images survive container rebuilds. Copy existing uploaded images there too
if the database references them. Open port 8080 in the VPS firewall and
hosting provider firewall, then verify signup, login, images, checkout, and
direct page refreshes from a browser. This IP link uses HTTP, so login and
customer data travel without transport encryption; set up HTTPS before
using it with real customers.

For a server without an existing proxy, `deploy/nginx.conf.example` is a
standalone Nginx alternative.
