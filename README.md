# CTF Challenge Repository

A small self-hosted site for publishing CTF challenges.

- **Public front page (`/`)** — anyone can see the list of challenges and download files.
- **Admin area (`/admin`)** — logged-in admins create, rename, and delete challenges (name + file upload).

Fully self-hosted: **SQLite** for data and the **local filesystem** for uploaded files. No external services.

## Stack

- Next.js 16 (App Router) + React 19 + Tailwind CSS v4
- `better-sqlite3` (database) · `bcryptjs` (password hashing) · `jose` (session JWT)

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` with a session secret (used to sign login cookies):

   ```bash
   # generate a random value:
   node -e "console.log('SESSION_SECRET=' + require('crypto').randomBytes(32).toString('hex'))" > .env.local
   ```

   Optional overrides: `DB_DIR`, `DB_PATH`, `UPLOAD_DIR`.

3. Create an admin account (there is no public sign-up):

   ```bash
   node scripts/create-admin.mjs admin "your-password"
   ```

   Run it again with a new username to add more admins, or with an existing username to reset that password.

4. Start the app:

   ```bash
   npm run dev
   ```

   Open http://localhost:3000. Log in at `/admin`.

## Data & backups

All state lives in two directories (both git-ignored, created automatically):

- `data/ctf.db` — SQLite database (admins + challenge metadata)
- `uploads/` — uploaded challenge files

Back up both together.

## Deploy to a VPS (Ubuntu + SSH)

Ready-made files live in `deploy/`. First-time setup on the server:

```bash
# 1. Install Node 20 + build tools (better-sqlite3 needs them) + nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs build-essential python3 git nginx

# 2. Clone the repo
sudo git clone <your-repo-url> /var/www/rpca-cyber
cd /var/www/rpca-cyber
sudo chown -R www-data:www-data /var/www/rpca-cyber   # service runs as www-data

# 3. Install, configure, build, seed admin
sudo -u www-data npm ci
sudo -u www-data bash -c 'node -e "console.log(\"SESSION_SECRET=\" + require(\"crypto\").randomBytes(32).toString(\"hex\"))" > .env.local'
sudo -u www-data npm run build
sudo -u www-data node scripts/create-admin.mjs admin "your-strong-password"

# 4. Run as a systemd service (keeps it alive + starts on boot)
sudo cp deploy/rpca-cyber.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now rpca-cyber

# 5. nginx reverse proxy + HTTPS
sudo cp deploy/nginx.conf /etc/nginx/sites-available/rpca-cyber
sudo nano /etc/nginx/sites-available/rpca-cyber          # set server_name
sudo ln -s /etc/nginx/sites-available/rpca-cyber /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com                  # HTTPS (required: cookie is Secure in prod)

# 6. Firewall
sudo ufw allow OpenSSH && sudo ufw allow 'Nginx Full' && sudo ufw enable
```

**Updating later** (after pushing new commits):

```bash
cd /var/www/rpca-cyber && sudo -u www-data ./scripts/deploy.sh
```

`data/` and `uploads/` hold all state and are git-ignored, so they survive every update. Back them up together (e.g. a daily `tar` cron).
