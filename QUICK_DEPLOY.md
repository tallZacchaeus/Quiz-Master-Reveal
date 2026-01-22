# Quick Reference: Deploy to Railway in 10 Minutes

## Step-by-Step

### 1. Prepare (1 min)
```bash
# Make sure everything is committed to GitHub
git add .
git commit -m "Ready for production"
git push
```

### 2. Create Account (2 min)
- Go to https://railway.app
- Click "Sign Up"
- Use GitHub login (recommended)

### 3. Create Project (2 min)
- Click "Create New Project"
- Select "Empty Project"
- Click "Add PostgreSQL"

### 4. Add App (1 min)
- Click "Add Service"
- Select "GitHub Repo"
- Find and select "Quiz-Master-Reveal"

### 5. Deploy (automatic)
- Railway auto-detects Node.js app
- Sets up environment variables
- Starts building (~2-5 minutes)

### 6. Access (< 1 min)
- Wait for "Deployed" status
- Click "Open URL"
- Your quiz app is live! 🎉

## Verify It Works

1. Visit your live URL
2. Click "Start Quiz"
3. Take a practice question
4. Check leaderboard
5. Go to /admin to toggle answer reveal

## That's It!

Your app is now live on the internet. Share the URL with your GVIM community!

---

## Need Help?

- **Stuck?** → Read [RAILWAY_DEPLOY.md](RAILWAY_DEPLOY.md)
- **General questions?** → See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Technical issues?** → Check troubleshooting in [DEPLOYMENT.md](DEPLOYMENT.md)

## Environment Variables (Auto-Set)

Railway automatically handles these:
- ✓ `DATABASE_URL` (PostgreSQL connection)
- ✓ `NODE_ENV` (production mode)
- ✓ `PORT` (3000 - automatically assigned)

**Nothing else to configure!**

---

### Cost
- **Railway free tier:** Includes $5 credits monthly
- **Your app likely costs:** $0-2/month
- **Estimate:** Free or very cheap 💰

### Performance
- **Page load:** <1 second
- **Quiz response:** instant
- **Results save:** instant
- **No lag** ✓

### What's Deployed
✓ Full React frontend  
✓ Express backend  
✓ PostgreSQL database  
✓ Answer reveal system  
✓ Leaderboard  
✓ Admin controls  

Good to go! 🚀
