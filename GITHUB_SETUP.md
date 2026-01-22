# Push Project to GitHub

Follow these steps to push your Quiz Master Reveal project to GitHub:

## Step 1: Create a GitHub Repository

1. Go to https://github.com/new
2. Sign in to your GitHub account (create one if needed)
3. Fill in the repository details:
   - **Repository name:** `Quiz-Master-Reveal`
   - **Description:** Quiz app with MCQ, timer, leaderboard, and admin controls
   - **Visibility:** Public (recommended) or Private
   - **DO NOT initialize** with README, .gitignore, or license (your repo already has these)
4. Click "Create repository"

## Step 2: Add GitHub as Remote

Copy the commands from your new GitHub repo (under "...or push an existing repository from the command line"):

```bash
cd "/Users/zacchaeusjames/Documents/Web projects/Quiz-Master-Reveal"

# Replace YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/Quiz-Master-Reveal.git
git branch -M main
git push -u origin main
```

## Step 3: Authenticate (First Time Only)

When you run `git push`, GitHub will ask for authentication:

### Option A: Personal Access Token (Recommended)
1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name: "Quiz Master Reveal Deploy"
4. Select scopes:
   - ✓ `repo` (full control of private repositories)
5. Click "Generate token"
6. Copy the token (you'll only see it once!)
7. Use as password when `git push` asks

### Option B: SSH (Alternative)
If you already have SSH keys set up, GitHub will auto-detect them.

## Step 4: Push Your Code

```bash
cd "/Users/zacchaeusjames/Documents/Web projects/Quiz-Master-Reveal"
git push -u origin main
```

This pushes your local repository to GitHub.

## Verify Success

1. Visit `https://github.com/YOUR_USERNAME/Quiz-Master-Reveal`
2. You should see all your project files
3. Check that these key files are there:
   - ✓ `package.json`
   - ✓ `server/`
   - ✓ `client/`
   - ✓ `QUICK_DEPLOY.md`
   - ✓ `DEPLOYMENT.md`

## Next: Deploy from GitHub

Once pushed to GitHub, you can:

1. **Deploy to Railway:**
   - Go to https://railway.app
   - Create new project
   - Select "GitHub Repo"
   - Choose your `Quiz-Master-Reveal` repo
   - Railway handles the rest!

2. **Deploy to Render:**
   - Go to https://render.com
   - Create new "Web Service"
   - Connect GitHub
   - Select your repository
   - Done!

## Useful Git Commands

After initial push, use these for updates:

```bash
# See what changed
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your message here"

# Push to GitHub
git push

# Pull latest from GitHub
git pull
```

## Troubleshooting

### "fatal: 'origin' already exists"
Remove old remote first:
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/Quiz-Master-Reveal.git
```

### "Permission denied" or "Authentication failed"
1. Make sure you used a valid personal access token or SSH key
2. For token: Try again and paste the token carefully
3. For SSH: Ensure your SSH key is added to GitHub

### "branch doesn't have upstream tracking"
Run this once:
```bash
git push -u origin main
```

The `-u` flag sets up tracking for future pushes.

---

## ✅ You're Ready!

Once pushed to GitHub, your project is ready for hosting on Railway, Render, or other platforms.

**Next:** Follow [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) to deploy to Railway!
