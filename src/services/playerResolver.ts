import { searchPlayers, getAllPlayers, type Player } from '../lib/firebase';

/**
 * Player Name Resolution Service
 * Uses fuzzy matching and LLM assistance to match user-entered names to NBA players
 */

interface MatchResult {
  player: Player | null;
  confidence: 'high' | 'medium' | 'low' | 'none';
  suggestions: Player[];
}

/**
 * Simple string similarity using Levenshtein distance
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
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Calculate similarity score (0-1, where 1 is identical)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

/**
 * Normalize name for comparison
 */
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' '); // Normalize spaces
}

/**
 * Extract potential name parts (first, last, full)
 */
function extractNameParts(name: string): { first: string; last: string; full: string } {
  const normalized = normalizeName(name);
  const parts = normalized.split(' ').filter(p => p.length > 0);
  
  return {
    first: parts[0] || '',
    last: parts[parts.length - 1] || '',
    full: normalized
  };
}

/**
 * Match player by exact or fuzzy search
 */
export async function resolvePlayerName(inputName: string): Promise<MatchResult> {
  try {
    if (!inputName || inputName.trim().length === 0) {
      return {
        player: null,
        confidence: 'none',
        suggestions: []
      };
    }

    const normalizedInput = normalizeName(inputName);
    const inputParts = extractNameParts(inputName);

    // First, try direct search
    const directResults = await searchPlayers(inputName);
    
    if (directResults.length > 0) {
      // Check for exact match
      const exactMatch = directResults.find(p => 
        normalizeName(p.full_name) === normalizedInput
      );
      
      if (exactMatch) {
        return {
          player: exactMatch,
          confidence: 'high',
          suggestions: directResults.slice(0, 5)
        };
      }
      
      // Check for very close match
      const closeMatch = directResults.find(p => {
        const similarity = calculateSimilarity(
          normalizeName(p.full_name),
          normalizedInput
        );
        return similarity > 0.9;
      });
      
      if (closeMatch) {
        return {
          player: closeMatch,
          confidence: 'high',
          suggestions: directResults.slice(0, 5)
        };
      }
    }

    // If no direct results, do fuzzy search on all players (cached)
    const allPlayers = await getAllPlayers();
    
    // Calculate similarity scores for all players
    const scoredPlayers = allPlayers.map(player => {
      const playerNormalized = normalizeName(player.full_name);
      const playerParts = extractNameParts(player.full_name);
      
      // Calculate multiple similarity metrics
      const fullNameSimilarity = calculateSimilarity(playerNormalized, normalizedInput);
      const lastNameSimilarity = calculateSimilarity(playerParts.last, inputParts.last);
      const firstNameSimilarity = calculateSimilarity(playerParts.first, inputParts.first);
      
      // Check nickname match
      let nicknameSimilarity = 0;
      if (player.nicknames) {
        const nicknames = player.nicknames.toLowerCase().split(',').map(n => n.trim());
        nicknameSimilarity = Math.max(
          ...nicknames.map(nick => calculateSimilarity(nick, normalizedInput))
        );
      }
      
      // Weighted score
      const score = Math.max(
        fullNameSimilarity * 1.0,
        (lastNameSimilarity * 0.7 + firstNameSimilarity * 0.3),
        nicknameSimilarity * 0.9
      );
      
      return { player, score };
    });

    // Sort by score and get top matches
    const topMatches = scoredPlayers
      .filter(s => s.score > 0.5) // Only consider matches above 50% similarity
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    if (topMatches.length === 0) {
      return {
        player: null,
        confidence: 'none',
        suggestions: []
      };
    }

    const bestMatch = topMatches[0];
    
    // Determine confidence based on score
    let confidence: 'high' | 'medium' | 'low' | 'none' = 'none';
    if (bestMatch.score > 0.9) {
      confidence = 'high';
    } else if (bestMatch.score > 0.75) {
      confidence = 'medium';
    } else if (bestMatch.score > 0.5) {
      confidence = 'low';
    }

    return {
      player: bestMatch.player,
      confidence,
      suggestions: topMatches.map(m => m.player)
    };
  } catch (error) {
    console.error('Error resolving player name:', error);
    return {
      player: null,
      confidence: 'none',
      suggestions: []
    };
  }
}

/**
 * Get player suggestions as user types (for autocomplete)
 */
export async function getPlayerSuggestions(partial: string, limit: number = 10): Promise<Player[]> {
  try {
    if (!partial || partial.trim().length < 2) {
      return [];
    }

    const results = await searchPlayers(partial);
    return results.slice(0, limit);
  } catch (error) {
    console.error('Error getting player suggestions:', error);
    return [];
  }
}

/**
 * Enhanced resolution using AI/LLM (placeholder for future implementation)
 * This could call an LLM API to handle more complex name variations
 */
export async function resolvePlayerNameWithAI(inputName: string): Promise<MatchResult> {
  // For now, falls back to fuzzy matching
  // In the future, this could call OpenAI, Claude, etc. to handle:
  // - "MJ" -> Michael Jordan
  // - "The King" -> LeBron James
  // - "Greek Freak" -> Giannis Antetokounmpo
  // - Misspellings and variations
  
  return resolvePlayerName(inputName);
}

