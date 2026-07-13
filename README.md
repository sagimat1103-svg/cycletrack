# Cycle Tracker

A private, multi-user menstrual cycle tracker: sign up, log in, mark period days on a calendar, log symptoms, and get a next-cycle estimate. Built with React + Vite, Supabase (auth + database), and deployed for free on Netlify.

## 1. Create your Supabase project (free)

1. Go to https://supabase.com and create a free account, then "New project."
2. Once it's ready, open **SQL Editor** in the left sidebar, paste in the contents of `supabase/schema.sql` from this project, and run it. This creates the two tables (`profiles`, `period_logs`) and locks them down with row-level security, so each signed-in user can only ever read or write their own rows.
3. Go to **Settings -> API**. You'll need two values from here in a moment: the **Project URL** and the **anon public** key.
4. (Optional but recommended) In **Authentication -> Providers**, confirm Email is enabled. By default Supabase requires email confirmation on sign-up — you can turn this off in **Authentication -> Settings** if you'd rather skip that step for a small private group.

## 2. Run it locally first (optional, to test)

```bash
npm install
cp .env.example .env
# edit .env and paste in your Project URL and anon key
npm run dev
```

Open the local URL it prints. Try signing up, log in, mark a few period days.

## 3. Push the code to GitHub

Create a new GitHub repository and push this project to it:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

(`.env` is already in `.gitignore` — your keys won't be committed.)

## 4. Deploy on Netlify (free)

1. Go to https://netlify.com, sign in, and choose **Add new site -> Import an existing project**.
2. Connect your GitHub account and pick this repository.
3. Build settings are already set via `netlify.toml` (`npm run build`, publish folder `dist`) — you shouldn't need to change anything.
4. Before deploying, add your environment variables: **Site configuration -> Environment variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy. Netlify gives you a free `.netlify.app` URL you can share right away (you can add a custom domain later, also free if you already own one).

## 5. Prevent the free Supabase project from pausing

Supabase pauses free projects after 7 days with no API activity. This repo includes a GitHub Actions workflow (`.github/workflows/keep-alive.yml`) that pings your project every 3 days automatically.

To activate it:
1. In your GitHub repo, go to **Settings -> Secrets and variables -> Actions**.
2. Add two repository secrets:
   - `SUPABASE_URL` — your Project URL
   - `SUPABASE_ANON_KEY` — your anon public key
3. That's it — GitHub will run the ping on schedule. You can also trigger it manually anytime from the **Actions** tab ("Keep Supabase Alive" -> "Run workflow").

If a project does pause anyway, your data is safe — just open the Supabase dashboard and click **Resume project**.

## What each person gets

Anyone who visits your Netlify link can sign up with their own email and password. Row-level security in `supabase/schema.sql` means each person's period days, symptoms, and profile answers are only ever visible to them — not to other users, and not editable by anyone else.

## Notes

- This is a personal tracking tool, not a medical device — cycle estimates are approximations.
- Free tier limits (as of mid-2026): Supabase gives 500 MB database storage and 50,000 monthly active users, which is far more than a small group will need. Netlify's free tier comfortably covers a small-to-medium site's traffic.
