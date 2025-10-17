/**
 * Team Name Mapper
 * Maps Basketball Reference API team format to standard abbreviations
 */

export const TEAM_MAPPINGS: Record<string, string> = {
  // Current Teams
  'Team.ATLANTA_HAWKS': 'ATL',
  'Team.BOSTON_CELTICS': 'BOS',
  'Team.BROOKLYN_NETS': 'BKN',
  'Team.CHARLOTTE_HORNETS': 'CHA',
  'Team.CHICAGO_BULLS': 'CHI',
  'Team.CLEVELAND_CAVALIERS': 'CLE',
  'Team.DALLAS_MAVERICKS': 'DAL',
  'Team.DENVER_NUGGETS': 'DEN',
  'Team.DETROIT_PISTONS': 'DET',
  'Team.GOLDEN_STATE_WARRIORS': 'GSW',
  'Team.HOUSTON_ROCKETS': 'HOU',
  'Team.INDIANA_PACERS': 'IND',
  'Team.LOS_ANGELES_CLIPPERS': 'LAC',
  'Team.LOS_ANGELES_LAKERS': 'LAL',
  'Team.MEMPHIS_GRIZZLIES': 'MEM',
  'Team.MIAMI_HEAT': 'MIA',
  'Team.MILWAUKEE_BUCKS': 'MIL',
  'Team.MINNESOTA_TIMBERWOLVES': 'MIN',
  'Team.NEW_ORLEANS_PELICANS': 'NOP',
  'Team.NEW_YORK_KNICKS': 'NYK',
  'Team.OKLAHOMA_CITY_THUNDER': 'OKC',
  'Team.ORLANDO_MAGIC': 'ORL',
  'Team.PHILADELPHIA_76ERS': 'PHI',
  'Team.PHILADELPHIA_SEVENTY_SIXERS': 'PHI', // Alternative format
  'Team.PHOENIX_SUNS': 'PHX',
  'Team.PORTLAND_TRAIL_BLAZERS': 'POR',
  'Team.SACRAMENTO_KINGS': 'SAC',
  'Team.SAN_ANTONIO_SPURS': 'SAS',
  'Team.TORONTO_RAPTORS': 'TOR',
  'Team.UTAH_JAZZ': 'UTA',
  'Team.WASHINGTON_WIZARDS': 'WAS',
  
  // Historical Teams
  'Team.SEATTLE_SUPERSONICS': 'SEA',
  'Team.NEW_JERSEY_NETS': 'NJN',
  'Team.VANCOUVER_GRIZZLIES': 'VAN',
  'Team.CHARLOTTE_BOBCATS': 'CHB',
  'Team.MINNEAPOLIS_LAKERS': 'MNL',
};

/**
 * Map Basketball Reference team format to standard abbreviation
 * @param brFormat - Team name in Basketball Reference format (e.g., "Team.BOSTON_CELTICS")
 * @returns Standard abbreviation (e.g., "BOS") or null if not found
 */
export function mapTeamAbbreviation(brFormat: string): string | null {
  return TEAM_MAPPINGS[brFormat] || null;
}

/**
 * Check if a team abbreviation is valid
 * @param abbr - Team abbreviation to check
 * @returns True if valid, false otherwise
 */
export function isValidTeamAbbreviation(abbr: string): boolean {
  return Object.values(TEAM_MAPPINGS).includes(abbr);
}

/**
 * Get all valid team abbreviations
 * @returns Array of all valid team abbreviations
 */
export function getAllTeamAbbreviations(): string[] {
  return Array.from(new Set(Object.values(TEAM_MAPPINGS)));
}

/**
 * Try to fuzzy match a team name
 * @param teamStr - Team string to match
 * @returns Matched abbreviation or null
 */
export function fuzzyMatchTeam(teamStr: string): string | null {
  // First try exact match
  const exact = mapTeamAbbreviation(teamStr);
  if (exact) return exact;
  
  // Try uppercase version with Team. prefix
  const withPrefix = `Team.${teamStr.toUpperCase().replace(/\s+/g, '_')}`;
  const prefixed = mapTeamAbbreviation(withPrefix);
  if (prefixed) return prefixed;
  
  // Try direct abbreviation match
  if (isValidTeamAbbreviation(teamStr.toUpperCase())) {
    return teamStr.toUpperCase();
  }
  
  return null;
}

