# GVIM Quiz Challenge

## Overview

A church quiz application for GVIM (God's Vineyard International Ministry) that allows members to test their knowledge about the church. The application features a timed quiz with 10 questions, a leaderboard system, and an admin panel to reveal correct answers after the quiz session ends.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state and caching
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming (royal purple/gold church theme)

### Backend Architecture
- **Framework**: Express.js (v5) running on Node.js
- **API Design**: RESTful JSON API with endpoints under `/api/`
- **Storage**: In-memory storage using a `MemStorage` class (Map-based data structures)
- **Session Handling**: Connect-pg-simple available for session management

### Key Design Decisions

1. **In-Memory Storage Over Database**: Quiz results are stored in memory rather than a persistent database. This simplifies deployment but means data is lost on restart. The architecture supports easy migration to PostgreSQL via Drizzle ORM when needed.

2. **Timed Quiz Mechanism**: Each question has a 20-second timer handled client-side. Answers are submitted in bulk at the end of the quiz.

3. **Admin-Controlled Answer Reveal**: Correct answers are hidden until an admin toggles the reveal setting, creating a controlled quiz experience for live events.

4. **Monorepo Structure**: 
   - `/client` - React frontend application
   - `/server` - Express backend API
   - `/shared` - Shared TypeScript types and schemas (Zod validation)

### Data Flow
1. User enters name on home page → stored in localStorage
2. Quiz page fetches questions from shared schema
3. Answers submitted to `/api/quiz/submit` → stored in memory
4. Results page displays score and optionally correct answers based on admin settings
5. Leaderboard updates via polling (10-second intervals)

## External Dependencies

### Database
- **Drizzle ORM**: Configured for PostgreSQL but not actively used (schema defined in `shared/schema.ts`)
- **PostgreSQL**: Connection expected via `DATABASE_URL` environment variable when database features are enabled

### Google Sheets Integration
- **googleapis**: Integration via Replit's Google Sheets connector for exporting quiz results
- Requires Replit-specific environment variables (`REPLIT_CONNECTORS_HOSTNAME`, `REPL_IDENTITY`)

### UI Component Libraries
- **Radix UI**: Comprehensive set of accessible, unstyled primitives
- **Shadcn/ui**: Pre-styled components using Tailwind CSS
- **Lucide React**: Icon library

### Build & Development
- **Vite**: Frontend bundler with HMR support
- **esbuild**: Server-side bundling for production
- **tsx**: TypeScript execution for development