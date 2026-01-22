# GVIM Quiz Challenge

A modern, interactive quiz application built with React, Vite, and Express.js. Test your knowledge with multiple-choice questions, track results on a leaderboard, and manage the quiz with a secure admin panel.

## Features

✨ **Interactive Quiz**
- 10 multiple-choice questions with 10-second timer per question
- Randomized answer options on each attempt
- Instant feedback with correct answer reveal
- Automatic score calculation

📊 **Leaderboard & Results**
- Top 10 participants ranking
- Score tracking and statistics
- Real-time results updates
- Admin access to all participant data

🔐 **Admin Panel**
- Secure authentication with code: `890456`
- Toggle answer visibility for all participants
- View detailed results and statistics
- Clear results to start new sessions
- Auto-refreshing leaderboard

🎨 **Modern UI**
- Beautiful gradient design with dark mode
- Responsive layout (mobile & desktop)
- Smooth animations and transitions
- Toast notifications for feedback

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Express.js + Node.js
- **Database**: PostgreSQL
- **Data Storage**: Google Sheets (optional)

## Quick Start

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Default Ports
- Frontend: `http://localhost:5173` (Vite dev server)
- Backend: `http://localhost:3000` (Express server)

## Usage

### For Participants
1. Navigate to the home page
2. Enter your name
3. Answer 10 MCQ questions (10 seconds per question)
4. View your score and position on the leaderboard
5. Restart to try again

### For Administrators
1. Go to `/admin`
2. Enter the admin code: `890456`
3. **Reveal Answers**: Toggle to show/hide correct answers to all participants
4. **View Results**: See all participant scores and statistics
5. **Clear Results**: Reset all data for a new quiz session
6. **Logout**: Exit the admin panel using the logout button

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Quiz, Results, Admin pages
│   │   ├── components/    # UI components (shadcn/ui)
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and API client
│   └── public/            # Static files (favicon, etc)
├── server/                # Express backend
│   ├── index.ts          # Main server entry
│   ├── routes.ts         # API endpoints
│   └── storage.ts        # Data persistence
├── shared/               # Shared TypeScript types
│   └── schema.ts         # Quiz questions and types
└── script/               # Build scripts
```

## Available Commands

```bash
# Development
npm run dev              # Start dev server with hot reload

# Building
npm run build            # Build for production
npm run build:client     # Build frontend only
npm run build:server     # Build backend only

# Production
npm run start            # Run production build
```

## Configuration Files

- **vite.config.ts**: Frontend build configuration
- **tsconfig.json**: TypeScript settings
- **tailwind.config.ts**: Tailwind CSS customization
- **drizzle.config.ts**: Database configuration
- **components.json**: shadcn/ui setup
- **package.json**: Dependencies and scripts

## Deployment

The application is production-ready and can be deployed to:
- **Railway**: Environment variables configured in `railway.json`
- **Render**: Procfile included for compatibility
- **Vercel**: Frontend can be deployed separately
- **Heroku**: Using Procfile configuration

Set the following environment variables on your hosting platform:
```
PORT=3000
NODE_ENV=production
```

## Admin Features

### Answer Visibility Toggle
Control whether participants can see correct answers after each question or at results screen.

### Statistics Dashboard
- Total participants count
- Average score across all attempts
- Number of perfect scores (10/10)

### Data Management
- View detailed results table with completion timestamps
- Export results (via download)
- Clear all results to start fresh

## Customization

### Quiz Questions
Edit quiz questions in `shared/schema.ts`:
- Modify question text
- Add/remove answer options
- Change correct answers

### Branding
- Update favicon in `client/public/favicon.svg`
- Modify app title in `client/index.html`
- Customize colors in `tailwind.config.ts`

### Admin Code
Change the admin authentication code in `client/src/pages/admin.tsx`:
```typescript
const ADMIN_CODE = "890456"; // Change this value
```

## Troubleshooting

**Quiz not loading?**
- Check if backend is running on port 3000
- Verify network connection
- Clear browser cache

**Admin panel not accessible?**
- Verify correct code: `890456`
- Check browser console for errors
- Ensure JavaScript is enabled

**Results not saving?**
- Check backend logs for database errors
- Verify environment variables are set
- Ensure backend service is running

## Support

For issues or questions, check the following:
1. Verify all dependencies are installed: `npm install`
2. Check that both frontend and backend are running: `npm run dev`
3. Look at browser console for error messages
4. Review backend terminal output for API errors

## License

This project is confidential and proprietary.

---

**Version**: 1.0.0  
**Last Updated**: January 2026
