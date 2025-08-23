# Database Setup Guide for RPA Connect

This guide will help you set up Netlify DB powered by Neon for the RPA Connect application with NBA player data.

## Prerequisites

1. A Netlify account with your site deployed
2. Access to Netlify DB (powered by Neon) - available in your Netlify dashboard

## Setup Steps

### 1. Enable Netlify DB

1. Go to your Netlify dashboard
2. Select your RPA Connect site
3. Navigate to the "Integrations" tab
4. Find "Netlify DB" and click "Enable"
5. This will create a Neon database for your project

### 2. Get Your Database Connection String

1. In Netlify dashboard, go to Site Settings → Environment Variables
2. Netlify automatically creates a `DATABASE_URL` environment variable
3. Copy this value for local development

### 3. Set Up Local Environment

1. Create a `.env` file in your project root (copy from `.env.example`):
```bash
cp .env.example .env
```

2. Add your database URL to the `.env` file:
```
VITE_DATABASE_URL=postgresql://[your-connection-string]
```

### 4. Initialize the Database Schema

Run the setup script to create all necessary tables:

```bash
npm run db:setup
```

This will create:
- NBA data tables (players, teams, seasons, player_team_seasons)
- RPA-specific tables (profiles, events, resources, pillar engagements)
- Useful views and indexes

### 5. Import NBA Data

Import the NBA player data from the NBA Database project:

```bash
npm run db:import
```

This will import:
- ~3,000+ NBA players
- 30 NBA teams
- Season data
- Player-team-season relationships
- Sample RPA profiles for demonstration

### 6. Verify the Setup

The import script will show you the counts of imported data:
- Total players imported
- Total teams imported
- Total seasons imported

## Database Schema Overview

### Core NBA Tables
- `players` - NBA player information
- `teams` - NBA team data
- `seasons` - NBA seasons
- `player_team_seasons` - Links players to teams and seasons

### RPA Platform Tables
- `rpa_profiles` - Extended profiles for retired players
- `events` - RPA events and programs
- `event_registrations` - Event attendance tracking
- `pillar_engagements` - Five Pillars activity tracking
- `resources` - Library of resources for members

## Using the Database in the App

The database is integrated via `src/lib/database.ts` which provides:

```typescript
// Search for players
const players = await searchPlayers("LeBron");

// Get player details
const player = await getPlayerById(16);

// Get player career history
const career = await getPlayerCareer(16);

// Get RPA profile
const profile = await getRPAProfile(16);

// Get upcoming events
const events = await getUpcomingEvents("community");
```

## Environment Variables

For production (Netlify):
- `DATABASE_URL` - Automatically set by Netlify DB

For local development:
- `VITE_DATABASE_URL` - Your Neon database connection string

## Troubleshooting

### Connection Issues
- Ensure your database URL includes `?sslmode=require`
- Check that your IP is allowed in Neon dashboard if using IP restrictions

### Import Errors
- Make sure the NBA Database project is in the correct location: `../NBA Database`
- Verify CSV files exist in `../NBA Database/nba_data/`

### Schema Issues
- If tables already exist, the setup script will skip them
- To reset, you can drop all tables and re-run setup

## Next Steps

1. The database is now ready for use in your application
2. You can start querying player data and building features
3. Consider adding more RPA-specific data as needed
4. Set up regular backups in Neon dashboard

## Support

For database issues:
- Netlify DB documentation: https://docs.netlify.com/integrations/databases/
- Neon documentation: https://neon.tech/docs