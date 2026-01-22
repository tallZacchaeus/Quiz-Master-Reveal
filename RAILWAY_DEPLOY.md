# Quick Start: Deploy to Railway

This guide will get your Quiz Master Reveal app live in minutes!

## Step 1: Prepare Your GitHub Repository

1. Make sure your code is pushed to GitHub
2. Verify `.gitignore` includes `.env.local` (already configured)
3. Run a final build test locally:
   ```bash
   npm run build
   npm start
   ```

## Step 2: Create Railway Account

1. Go to https://railway.app
2. Click "Sign Up"
3. Choose "Continue with GitHub" (recommended)
4. Authorize Railway to access your GitHub account

## Step 3: Create New Project

1. Click "Create New Project"
2. Select "Empty Project"
3. Click "Add a Service" → select "PostgreSQL"
   - Railway will auto-provision a database
   - It will automatically set `DATABASE_URL` variable

## Step 4: Add Your Application

1. Click "Add a Service" → "GitHub Repo"
2. Select your `Quiz-Master-Reveal` repository
3. Railway auto-detects the Node.js app

## Step 5: Configure Environment Variables

Railway automatically detects:
- ✓ `DATABASE_URL` (from PostgreSQL service)

You may need to add:
- `NODE_ENV=production`
- `PORT=3000` (usually auto-assigned, but you can set it)

### If Using Google Sheets Integration:

If you're using Google Sheets to store results:

1. Go to Project Settings → Variables
2. Add your Google credentials:
   - `REPL_IDENTITY` (if you have a Replit account)
   - `REPLIT_CONNECTORS_HOSTNAME` (if applicable)

For most hosting, consider storing results in PostgreSQL instead. The current in-memory storage won't persist between restarts.

## Step 6: Deploy

1. The deployment starts automatically when you connect your repo
2. Watch the build logs in the Railway dashboard
3. Once "Deployed" appears, your app is live!

## Step 7: Access Your App

1. Go to your Railway project
2. Click on your service
3. Click "Open URL" or find the public URL
4. Your quiz app is now live! 🎉

## Step 8: Test Your Deployment

1. Visit your live URL
2. Test the quiz functionality
3. Verify results are being saved
4. Check the leaderboard

## Environment Variables Reference

| Variable | Value | Required |
|----------|-------|----------|
| `DATABASE_URL` | Auto-set by PostgreSQL | Yes |
| `NODE_ENV` | `production` | Yes |
| `PORT` | Auto-assigned | Auto |
| `HOST` | `0.0.0.0` | Auto |

## Troubleshooting

### App won't start
- Check build logs in Railway dashboard
- Verify `npm run build` succeeds locally
- Check that `.env` variables are set

### Database not connecting
- Ensure PostgreSQL service is running
- Check `DATABASE_URL` is set correctly
- Run migrations: `npm run db:push`

### Port errors
- Railway auto-manages ports
- Don't hardcode ports in code
- Ensure code uses `process.env.PORT`

### Still having issues?
- Check Railway logs: Project → Service → Logs
- Verify your code works with `npm start` locally
- Contact Railway support through dashboard

## What's Deployed?

✓ Full-stack Node.js + React app
✓ PostgreSQL database
✓ Express API server
✓ Vite-built React frontend
✓ Admin controls
✓ Results leaderboard
✓ Answer reveal functionality

## Next Steps

1. **Monitor your app** in Railway dashboard
2. **Set up custom domain** (optional, in Railway settings)
3. **Enable auto-deployments** when you push to GitHub
4. **Configure backups** for your PostgreSQL database
5. **Scale up** if needed (easy slider in Railway dashboard)

---

**Need help?** Check the [DEPLOYMENT.md](./DEPLOYMENT.md) file for more details and alternatives.
