# Deployment Guide - Quiz Master Reveal

This guide will help you deploy the Quiz Master Reveal application online. We recommend **Railway** or **Render** for the best experience with full-stack Node.js + PostgreSQL apps.

## Recommended Hosting Options

### 1. **Railway** (⭐ RECOMMENDED)
Railway is perfect for this project as it handles both Node.js backend and PostgreSQL database seamlessly.

**Pros:**
- Simple one-click deployment
- Built-in PostgreSQL database
- Environment variables management
- Automatic scaling
- Free tier available

**Steps:**

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub/Email

2. **Create New Project**
   - Click "Create New" → "Empty Project"
   - Add PostgreSQL plugin

3. **Connect GitHub Repository**
   - Link your GitHub repository
   - Railway will auto-detect the build configuration

4. **Set Environment Variables**
   - Go to Project Settings → Variables
   - Add required variables:
     ```
     DATABASE_URL=postgresql://...  (Auto-filled by PostgreSQL plugin)
     NODE_ENV=production
     PORT=3000
     ```

5. **Deploy**
   - Push to main branch or manually trigger deploy
   - Railway automatically runs `npm run build` and `npm start`

---

### 2. **Render** (Alternative)
Similar to Railway but with different pricing model.

**Steps:**

1. Go to https://render.com
2. Create new "Web Service"
3. Connect GitHub repository
4. Configure:
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Environment:** Node
   - **Region:** Choose closest to users

5. Add PostgreSQL database separately
6. Set `DATABASE_URL` environment variable

---

### 3. **Vercel + Backend Separation** (Complex)
If you prefer Vercel, you'd need to:
- Host frontend on Vercel (easier)
- Host backend on a separate service like Railway/Render
- Update API URLs for production

Not recommended for this project structure.

---

## Environment Variables Required

Create a `.env.production` file or set these in your hosting platform:

```
# Database (provided by hosting platform's PostgreSQL)
DATABASE_URL=postgresql://user:password@host:port/dbname

# Server
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Google Sheets Integration
REPL_IDENTITY=your_repl_identity  (if using Replit)
REPLIT_CONNECTORS_HOSTNAME=...     (if using Replit)
```

---

## Pre-Deployment Checklist

- [ ] Update server binding to use `HOST` and `PORT` env vars ✓ (Done)
- [ ] Remove Replit-specific code ✓ (Done in vite.config.ts)
- [ ] Ensure `npm run build` works locally
- [ ] Test with `npm start` in production mode
- [ ] Set up PostgreSQL database
- [ ] Configure Google Sheets API credentials
- [ ] Update API endpoints if needed

---

## Local Testing (Production Mode)

Before deploying, test the production build locally:

```bash
# Build the project
npm run build

# Start in production mode
NODE_ENV=production npm start
```

Visit http://localhost:3000

---

## Database Migrations

Railway/Render will auto-create tables on first deploy using Drizzle migrations.

If you need to push migrations manually:

```bash
npm run db:push
```

---

## Troubleshooting

### Port Already in Use
- Railway/Render automatically manages ports
- Don't hardcode port 5000/3000

### Database Connection Errors
- Verify `DATABASE_URL` is set correctly
- Check database credentials
- Ensure PostgreSQL is running

### Build Failures
- Check that `npm run build` works locally
- Verify all TypeScript compilation passes: `npm run check`
- Ensure `.env` files are not in `.gitignore` (but `.env.local` should be)

### Google Sheets Not Connecting
- Verify Google API credentials in environment
- Check that the service account has proper permissions

---

## Monitoring & Logs

**Railway:**
- Logs available in project dashboard
- Real-time deployment logs

**Render:**
- Logs in service dashboard
- Historical logs available

---

## Next Steps

1. Choose your hosting platform (Railway recommended)
2. Connect your GitHub repository
3. Set environment variables
4. Deploy!
5. Visit your live URL
6. Test quiz functionality
7. Verify results are saved to Google Sheets

---

## Additional Resources

- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)
- [Express Deployment Guide](https://expressjs.com/en/advanced/best-practice-performance.html)
- [PostgreSQL Connection Strings](https://www.postgresql.org/docs/current/libpq-connect-string.html)
