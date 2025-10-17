/**
 * Player Name Matcher
 * Fuzzy matching for player names using Levenshtein distance
 */

/**
 * Calculate Levenshtein distance between two strings
 * @param str1 - First string
 * @param str2 - Second string
 * @returns Distance (number of edits needed)
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

/**
 * Calculate similarity score between two strings (0-1, where 1 is identical)
 * @param str1 - First string
 * @param str2 - Second string
 * @returns Similarity score
 */
function calculateSimilarity(str1: string, str2: string): number {
  const maxLength = Math.max(str1.length, str2.length);
  if (maxLength === 0) return 1.0;
  const distance = levenshteinDistance(str1, str2);
  return 1 - (distance / maxLength);
}

/**
 * Normalize a name for matching
 * @param name - Name to normalize
 * @returns Normalized name
 */
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .normalize('NFD') // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z\s]/g, '') // Remove non-letters
    .replace(/\s+/g, ' '); // Normalize spaces
}

export interface PlayerMatch {
  player_id: string;
  full_name: string;
  similarity: number;
}

export interface PlayerReference {
  player_id: string;
  full_name: string;
}

/**
 * Find the best matching player from a list
 * @param targetName - Name to match
 * @param playerList - List of players to search
 * @param threshold - Minimum similarity threshold (default: 0.85)
 * @returns Best match with similarity score, or null if no good match
 */
export function findBestPlayerMatch(
  targetName: string,
  playerList: PlayerReference[],
  threshold: number = 0.85
): PlayerMatch | null {
  
  let bestMatch: PlayerMatch | null = null;
  let bestScore = 0;
  
  const normalizedTarget = normalizeName(targetName);
  
  for (const player of playerList) {
    const normalizedPlayer = normalizeName(player.full_name);
    
    // Exact match (normalized)
    if (normalizedTarget === normalizedPlayer) {
      return {
        player_id: player.player_id,
        full_name: player.full_name,
        similarity: 1.0
      };
    }
    
    // Fuzzy match using Levenshtein distance
    const similarity = calculateSimilarity(normalizedTarget, normalizedPlayer);
    
    if (similarity > bestScore && similarity >= threshold) {
      bestScore = similarity;
      bestMatch = {
        player_id: player.player_id,
        full_name: player.full_name,
        similarity
      };
    }
  }
  
  return bestMatch;
}

/**
 * Find all players matching above a threshold
 * @param targetName - Name to match
 * @param playerList - List of players to search
 * @param threshold - Minimum similarity threshold
 * @param maxResults - Maximum number of results to return
 * @returns Array of matches sorted by similarity (descending)
 */
export function findAllPlayerMatches(
  targetName: string,
  playerList: PlayerReference[],
  threshold: number = 0.75,
  maxResults: number = 5
): PlayerMatch[] {
  
  const normalizedTarget = normalizeName(targetName);
  const matches: PlayerMatch[] = [];
  
  for (const player of playerList) {
    const normalizedPlayer = normalizeName(player.full_name);
    const similarity = calculateSimilarity(normalizedTarget, normalizedPlayer);
    
    if (similarity >= threshold) {
      matches.push({
        player_id: player.player_id,
        full_name: player.full_name,
        similarity
      });
    }
  }
  
  // Sort by similarity descending
  matches.sort((a, b) => b.similarity - a.similarity);
  
  // Limit results
  return matches.slice(0, maxResults);
}

/**
 * Check if two player names are likely the same person
 * @param name1 - First name
 * @param name2 - Second name
 * @param threshold - Similarity threshold (default: 0.9)
 * @returns True if names are likely the same person
 */
export function areNamesSimilar(name1: string, name2: string, threshold: number = 0.9): boolean {
  const normalized1 = normalizeName(name1);
  const normalized2 = normalizeName(name2);
  
  if (normalized1 === normalized2) return true;
  
  const similarity = calculateSimilarity(normalized1, normalized2);
  return similarity >= threshold;
}

