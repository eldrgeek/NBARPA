import { neon } from '@neondatabase/serverless';

// Database connection
const getDatabaseUrl = () => {
  // Check multiple possible environment variable names
  return import.meta.env.VITE_DATABASE_URL || 
         import.meta.env.VITE_NEON_DATABASE_URL ||
         import.meta.env.DATABASE_URL ||
         import.meta.env.NEON_DATABASE_URL;
};

const DATABASE_URL = getDatabaseUrl();

if (!DATABASE_URL) {
  console.warn('Database URL not configured. Database features will be unavailable.');
}

export const sql = DATABASE_URL ? neon(DATABASE_URL) : null;

// Database query functions
export interface Player {
  player_id: number;
  full_name: string;
  nicknames?: string;
  position?: string;
  birth_date?: string;
}

export interface Team {
  team_id: number;
  team_name: string;
  abbreviation: string;
  location?: string;
}

export interface RPAProfile {
  profile_id: number;
  player_id: number;
  email?: string;
  phone?: string;
  bio?: string;
  profile_image_url?: string;
  linkedin_url?: string;
  twitter_handle?: string;
  is_active: boolean;
}

export interface Event {
  event_id: number;
  title: string;
  description?: string;
  event_date: string;
  location?: string;
  pillar_type?: string;
  max_attendees?: number;
  is_virtual: boolean;
  registration_url?: string;
}

// Player queries
export async function searchPlayers(query: string): Promise<Player[]> {
  if (!sql) return [];
  
  try {
    const results = await sql`
      SELECT player_id, full_name, position, nicknames
      FROM players
      WHERE LOWER(full_name) LIKE ${'%' + query.toLowerCase() + '%'}
      ORDER BY full_name
      LIMIT 20
    `;
    return results as Player[];
  } catch (error) {
    console.error('Error searching players:', error);
    return [];
  }
}

export async function getPlayerById(playerId: number): Promise<Player | null> {
  if (!sql) return null;
  
  try {
    const results = await sql`
      SELECT *
      FROM players
      WHERE player_id = ${playerId}
    `;
    return results[0] as Player || null;
  } catch (error) {
    console.error('Error fetching player:', error);
    return null;
  }
}

export async function getPlayerCareer(playerId: number) {
  if (!sql) return null;
  
  try {
    const results = await sql`
      SELECT 
        s.season_label,
        t.team_name,
        t.abbreviation,
        pts.games_played
      FROM player_team_seasons pts
      JOIN teams t ON pts.team_id = t.team_id
      JOIN seasons s ON pts.season_id = s.season_id
      WHERE pts.player_id = ${playerId}
      ORDER BY s.start_year DESC
    `;
    return results;
  } catch (error) {
    console.error('Error fetching player career:', error);
    return [];
  }
}

// RPA Profile queries
export async function getRPAProfile(playerId: number): Promise<RPAProfile | null> {
  if (!sql) return null;
  
  try {
    const results = await sql`
      SELECT *
      FROM rpa_profiles
      WHERE player_id = ${playerId}
    `;
    return results[0] as RPAProfile || null;
  } catch (error) {
    console.error('Error fetching RPA profile:', error);
    return null;
  }
}

export async function getActiveRPAMembers(): Promise<any[]> {
  if (!sql) return [];
  
  try {
    const results = await sql`
      SELECT 
        p.player_id,
        p.full_name,
        p.position,
        rp.email,
        rp.bio,
        rp.profile_image_url
      FROM rpa_profiles rp
      JOIN players p ON rp.player_id = p.player_id
      WHERE rp.is_active = true
      ORDER BY p.full_name
      LIMIT 50
    `;
    return results;
  } catch (error) {
    console.error('Error fetching active RPA members:', error);
    return [];
  }
}

// Event queries
export async function getUpcomingEvents(pillarType?: string): Promise<Event[]> {
  if (!sql) return [];
  
  try {
    let query;
    if (pillarType) {
      query = sql`
        SELECT *
        FROM events
        WHERE event_date >= NOW()
        AND pillar_type = ${pillarType}
        ORDER BY event_date
        LIMIT 10
      `;
    } else {
      query = sql`
        SELECT *
        FROM events
        WHERE event_date >= NOW()
        ORDER BY event_date
        LIMIT 10
      `;
    }
    const results = await query;
    return results as Event[];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

// Pillar engagement tracking
export async function trackPillarEngagement(
  profileId: number,
  pillarType: string,
  activityType: string,
  notes?: string
) {
  if (!sql) return false;
  
  try {
    await sql`
      INSERT INTO pillar_engagements (profile_id, pillar_type, engagement_date, activity_type, notes)
      VALUES (${profileId}, ${pillarType}, NOW(), ${activityType}, ${notes})
    `;
    return true;
  } catch (error) {
    console.error('Error tracking engagement:', error);
    return false;
  }
}

// Stats queries
export async function getDatabaseStats() {
  if (!sql) return null;
  
  try {
    const stats = await sql`
      SELECT 
        (SELECT COUNT(*) FROM players) as total_players,
        (SELECT COUNT(*) FROM teams) as total_teams,
        (SELECT COUNT(*) FROM seasons) as total_seasons,
        (SELECT COUNT(*) FROM rpa_profiles WHERE is_active = true) as active_members,
        (SELECT COUNT(*) FROM events WHERE event_date >= NOW()) as upcoming_events
    `;
    return stats[0];
  } catch (error) {
    console.error('Error fetching database stats:', error);
    return null;
  }
}