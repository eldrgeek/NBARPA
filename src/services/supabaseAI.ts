import { supabase } from '../lib/supabase';

export interface AIResponse {
  content: string;
  confidence: number;
  metadata?: Record<string, any>;
}

export class SupabaseAI {
  private sessionId: string;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
  }

  async generateResponse(
    prompt: string, 
    context?: Record<string, any>
  ): Promise<AIResponse> {
    try {
      // Check if Supabase AI is available
      if (typeof (globalThis as any).Supabase?.ai?.Session === 'function') {
        return await this.useSupabaseAI(prompt, context);
      } else {
        // Fallback to mock AI responses
        return await this.useMockAI(prompt, context);
      }
    } catch (error) {
      console.error('AI generation failed:', error);
      return await this.useMockAI(prompt, context);
    }
  }

  private async useSupabaseAI(
    prompt: string, 
    context?: Record<string, any>
  ): Promise<AIResponse> {
    try {
      // Initialize Supabase AI session
      const session = new (globalThis as any).Supabase.ai.Session('text-generation');
      
      // Build enhanced prompt with context
      const enhancedPrompt = this.buildEnhancedPrompt(prompt, context);
      
      // Generate response using Supabase AI
      const response = await session.run(enhancedPrompt, {
        max_tokens: 300,
        temperature: 0.7,
        top_p: 0.9
      });

      return {
        content: response.text || response,
        confidence: response.confidence || 0.8,
        metadata: {
          model: 'supabase-ai',
          tokens: response.tokens,
          sessionId: this.sessionId
        }
      };
    } catch (error) {
      console.error('Supabase AI error:', error);
      throw error;
    }
  }

  private async useMockAI(
    prompt: string, 
    context?: Record<string, any>
  ): Promise<AIResponse> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

    const responses = this.getMockResponses(prompt, context);
    const selectedResponse = responses[Math.floor(Math.random() * responses.length)];

    return {
      content: selectedResponse,
      confidence: 0.85,
      metadata: {
        model: 'mock-ai',
        sessionId: this.sessionId
      }
    };
  }

  private buildEnhancedPrompt(prompt: string, context?: Record<string, any>): string {
    let enhancedPrompt = `You are an AI transition coach helping retired NBA players navigate their post-basketball careers. You are conversational, empathetic, and knowledgeable about basketball.

`;

    if (context?.playerData) {
      enhancedPrompt += `Player Information:
- Name: ${context.playerData.name}
- Position: ${context.playerData.position || 'Unknown'}
- Teams: ${context.playerData.teams?.join(', ') || 'Unknown'}
- Years Active: ${context.playerData.yearsActive || 'Unknown'}
- Achievements: ${context.playerData.achievements?.join(', ') || 'None listed'}

`;
    }

    if (context?.conversationHistory) {
      enhancedPrompt += `Recent Conversation:
${context.conversationHistory.slice(-3).map((msg: any) => 
  `${msg.type === 'user' ? 'Player' : 'Coach'}: ${msg.content}`
).join('\n')}

`;
    }

    if (context?.currentStep) {
      enhancedPrompt += `Current Assessment Step: ${context.currentStep}

`;
    }

    enhancedPrompt += `Player's message: "${prompt}"

Respond as a supportive AI coach. Keep responses conversational, not too long, and focused on helping the player explore their transition. Ask follow-up questions when appropriate.

Response:`;

    return enhancedPrompt;
  }

  private getMockResponses(prompt: string, context?: Record<string, any>): string[] {
    const playerName = context?.playerData?.name?.split(' ')[0] || 'friend';
    const lowerPrompt = prompt.toLowerCase();

    // Emotional state responses
    if (lowerPrompt.includes('feel') || lowerPrompt.includes('emotion')) {
      return [
        `I hear you, ${playerName}. Those feelings make complete sense. Transitioning from professional sports brings up so many different emotions. What's been the most challenging part for you?`,
        `Thank you for sharing that with me, ${playerName}. It takes courage to be honest about how you're feeling. Many players experience similar emotions during this transition.`,
        `That's really insightful, ${playerName}. Your awareness of these feelings is actually a strength. How long have you been feeling this way?`
      ];
    }

    // Career fulfillment responses
    if (lowerPrompt.includes('fulfil') || lowerPrompt.includes('meaning') || lowerPrompt.includes('basketball')) {
      return [
        `That's beautiful, ${playerName}. It sounds like those moments really defined what basketball meant to you. What made those experiences so special?`,
        `I can hear the passion in your words, ${playerName}. Those are the kinds of experiences that shape who we are. How do you think those values might translate to your next chapter?`,
        `Wow, ${playerName}. That's exactly the kind of fulfillment that many people search for their whole lives. What elements of that could you see yourself pursuing now?`
      ];
    }

    // Interest exploration responses
    if (lowerPrompt.includes('interest') || lowerPrompt.includes('enjoy') || lowerPrompt.includes('love')) {
      return [
        `Those sound fascinating, ${playerName}! I can tell you're someone who values growth and challenge. What draws you most to these activities?`,
        `That's exciting to hear, ${playerName}. It sounds like you have some clear directions you're curious about. Have you had a chance to explore any of these more deeply?`,
        `I love hearing about what energizes you, ${playerName}. These interests could really be the foundation for your next chapter. Which one makes you most excited?`
      ];
    }

    // Future goals responses
    if (lowerPrompt.includes('goal') || lowerPrompt.includes('future') || lowerPrompt.includes('hope')) {
      return [
        `Those are some powerful aspirations, ${playerName}. I can sense the same drive that made you successful in basketball is still very much there. What would achieving these goals mean to you?`,
        `That's inspiring, ${playerName}. You're thinking about impact and legacy, which shows real maturity. What's the first step you think you'd need to take?`,
        `I can see you've given this real thought, ${playerName}. These goals align beautifully with your values. How do you envision getting started?`
      ];
    }

    // Default responses
    return [
      `That's really interesting, ${playerName}. Tell me more about that.`,
      `I appreciate you sharing that with me, ${playerName}. What else comes to mind when you think about this?`,
      `Thank you for being so open, ${playerName}. How does that make you feel?`,
      `That's a great point, ${playerName}. Can you help me understand what that means to you?`
    ];
  }

  async saveInteraction(
    prompt: string, 
    response: AIResponse, 
    context?: Record<string, any>
  ): Promise<void> {
    try {
      await supabase
        .from('ai_interactions')
        .insert({
          session_id: this.sessionId,
          prompt,
          response: response.content,
          confidence: response.confidence,
          metadata: response.metadata,
          context,
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error saving AI interaction:', error);
    }
  }
}