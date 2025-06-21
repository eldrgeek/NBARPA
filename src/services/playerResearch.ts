import { supabase } from '../lib/supabase';

export interface PlayerResearchData {
  name: string;
  position?: string;
  teams?: string[];
  yearsActive?: string;
  achievements?: string[];
  personalInfo?: {
    family?: string;
    currentAge?: number;
    retirementYear?: number;
  };
  careerHighlights?: string[];
}

// Mock research service - in production this would call external APIs
export const researchPlayer = async (name: string): Promise<PlayerResearchData | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock data for Greg Foster and other test cases
  const mockData: Record<string, PlayerResearchData> = {
    'greg foster': {
      name: 'Greg Foster',
      position: 'Center',
      teams: ['Washington Bullets', 'Atlanta Hawks', 'Milwaukee Bucks', 'Chicago Bulls', 'Minnesota Timberwolves', 'Utah Jazz', 'Seattle SuperSonics', 'Los Angeles Lakers'],
      yearsActive: '1990-2004',
      achievements: ['NBA Champion (2001 with Lakers)', '14-year NBA career'],
      personalInfo: {
        family: 'Married with children',
        currentAge: 55,
        retirementYear: 2004
      },
      careerHighlights: [
        'Played 14 seasons in the NBA',
        'Won NBA Championship with Lakers in 2001',
        'Known for his defensive presence and rebounding',
        'Played for 8 different NBA teams'
      ]
    },
    'michael jordan': {
      name: 'Michael Jordan',
      position: 'Shooting Guard',
      teams: ['Chicago Bulls', 'Washington Wizards'],
      yearsActive: '1984-2003',
      achievements: ['6× NBA Champion', '5× NBA MVP', '14× NBA All-Star'],
      personalInfo: {
        family: 'Married to Yvette Prieto, 5 children',
        currentAge: 61,
        retirementYear: 2003
      },
      careerHighlights: [
        'Widely regarded as the greatest basketball player of all time',
        'Led Bulls to 6 NBA championships',
        'Olympic gold medalist',
        'Successful businessman and team owner'
      ]
    }
  };

  const playerKey = name.toLowerCase().trim();
  return mockData[playerKey] || null;
};

export const cachePlayerResearch = async (playerData: PlayerResearchData): Promise<void> => {
  try {
    const { error } = await supabase
      .from('player_profiles')
      .upsert({
        name: playerData.name,
        research_data: playerData,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error caching player research:', error);
  }
};

export const getCachedPlayerResearch = async (name: string): Promise<PlayerResearchData | null> => {
  try {
    const { data, error } = await supabase
      .from('player_profiles')
      .select('research_data')
      .eq('name', name)
      .limit(1);

    if (error) {
      console.error('Error getting cached research:', error);
      return null;
    }

    if (!data || data.length === 0) return null;
    return data[0].research_data;
  } catch (error) {
    console.error('Error getting cached research:', error);
    return null;
  }
};