import { supabase } from '../lib/supabase';
import { PlayerResearchData } from './playerResearch';
import { SupabaseAI, AIResponse } from './supabaseAI';

export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export interface ConversationState {
  playerId: string;
  playerData: PlayerResearchData | null;
  messages: Message[];
  currentStep: string;
  assessmentData: Record<string, any>;
}

export class ConversationAI {
  private state: ConversationState;
  private supabaseAI: SupabaseAI;

  constructor(playerId: string, playerData: PlayerResearchData | null = null) {
    this.state = {
      playerId,
      playerData,
      messages: [],
      currentStep: 'introduction',
      assessmentData: {}
    };
    this.supabaseAI = new SupabaseAI(playerId);
  }

  async generateResponse(userMessage: string): Promise<string> {
    // Add user message to conversation
    this.addMessage('user', userMessage);

    let response = '';

    // Check for special commands first
    if (userMessage.toLowerCase().includes('ready to begin')) {
      response = this.handleReadyToBegin();
    } else {
      // Use AI to generate contextual response
      response = await this.generateAIResponse(userMessage);
    }

    this.addMessage('ai', response);
    await this.saveConversation();
    return response;
  }

  private async generateAIResponse(userMessage: string): Promise<string> {
    try {
      const context = {
        playerData: this.state.playerData,
        currentStep: this.state.currentStep,
        conversationHistory: this.state.messages.slice(-5), // Last 5 messages for context
        assessmentData: this.state.assessmentData
      };

      const aiResponse: AIResponse = await this.supabaseAI.generateResponse(userMessage, context);
      
      // Save the AI interaction
      await this.supabaseAI.saveInteraction(userMessage, aiResponse, context);

      // Update assessment data based on the conversation
      this.updateAssessmentData(userMessage, aiResponse.content);

      return aiResponse.content;
    } catch (error) {
      console.error('AI response generation failed:', error);
      return this.getFallbackResponse(userMessage);
    }
  }

  private handleReadyToBegin(): string {
    this.state.currentStep = 'emotional_state';
    const playerName = this.state.playerData?.name.split(' ')[0] || 'friend';
    const yearsRetired = this.state.playerData?.personalInfo?.retirementYear ? 
      new Date().getFullYear() - this.state.playerData.personalInfo.retirementYear : 0;
    
    if (this.state.playerData && yearsRetired > 5) {
      return `Glad to meet you, ${playerName}! I've never seen you play in person—other than on YouTube—but I know a lot about you. I'm an AI, but you might say I'm a fan of sorts.\n\nI know you retired a while back. How did you feel when you first stepped away from the game, and how do you feel about it now?`;
    } else if (this.state.playerData) {
      return `Glad to meet you, ${playerName}! I've never seen you play in person—other than on YouTube—but I know a lot about you. I'm an AI, but you might say I'm a fan of sorts.\n\nI understand you've recently transitioned away from professional basketball. How are you feeling about this new chapter?`;
    } else {
      return `Great to meet you! I'm here to help you navigate your transition from professional basketball. Even though I don't have specific details about your career, I'm excited to learn about your journey.\n\nHow are you feeling about this transition away from the game?`;
    }
  }

  private updateAssessmentData(userMessage: string, aiResponse: string): void {
    const lowerMessage = userMessage.toLowerCase();
    
    // Extract assessment data based on conversation content
    if (this.state.currentStep === 'emotional_state' || lowerMessage.includes('feel')) {
      this.state.assessmentData.emotionalState = userMessage;
      this.state.currentStep = 'career_fulfillment';
    } else if (this.state.currentStep === 'career_fulfillment' || lowerMessage.includes('fulfil') || lowerMessage.includes('basketball')) {
      this.state.assessmentData.careerFulfillment = userMessage;
      this.state.currentStep = 'interests';
    } else if (this.state.currentStep === 'interests' || lowerMessage.includes('interest') || lowerMessage.includes('enjoy')) {
      this.state.assessmentData.interests = userMessage;
      this.state.currentStep = 'future_goals';
    } else if (this.state.currentStep === 'future_goals' || lowerMessage.includes('goal') || lowerMessage.includes('future')) {
      this.state.assessmentData.futureGoals = userMessage;
      this.state.currentStep = 'purpose';
    } else if (this.state.currentStep === 'purpose' || lowerMessage.includes('purpose') || lowerMessage.includes('meaning')) {
      this.state.assessmentData.purpose = userMessage;
      this.state.currentStep = 'support';
    } else if (this.state.currentStep === 'support' || lowerMessage.includes('support') || lowerMessage.includes('help')) {
      this.state.assessmentData.support = userMessage;
      this.state.currentStep = 'completion';
    }
  }

  private getFallbackResponse(userMessage: string): string {
    const playerName = this.state.playerData?.name.split(' ')[0] || 'friend';
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('feel') || lowerMessage.includes('emotion')) {
      return `I hear you, ${playerName}. Those feelings make complete sense. Transitioning from professional sports brings up so many different emotions. What's been the most challenging part for you?`;
    } else if (lowerMessage.includes('basketball') || lowerMessage.includes('career')) {
      return `That's really insightful, ${playerName}. Your basketball career clearly shaped who you are. What aspects of that experience do you think will serve you best in this next chapter?`;
    } else if (lowerMessage.includes('future') || lowerMessage.includes('goal')) {
      return `Those are some powerful aspirations, ${playerName}. I can sense the same drive that made you successful in basketball is still very much there. What would achieving these goals mean to you?`;
    } else {
      return `That's really interesting, ${playerName}. Tell me more about that. I'm here to listen and help you explore these thoughts.`;
    }
  }

  private addMessage(type: 'user' | 'ai', content: string): void {
    const message: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    this.state.messages.push(message);
  }

  private async saveConversation(): Promise<void> {
    try {
      const { error } = await supabase
        .from('conversations')
        .upsert({
          player_id: this.state.playerId,
          messages: this.state.messages,
          assessment_data: this.state.assessmentData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  }

  getState(): ConversationState {
    return { ...this.state };
  }

  generateConfirmationMessage(playerData: PlayerResearchData): string {
    const description = this.buildPlayerDescription(playerData);
    return `Are you the ${playerData.name} who ${description}?`;
  }

  private buildPlayerDescription(playerData: PlayerResearchData): string {
    const parts = [];
    
    if (playerData.position) {
      parts.push(`played ${playerData.position.toLowerCase()}`);
    }
    
    if (playerData.teams && playerData.teams.length > 0) {
      if (playerData.teams.length === 1) {
        parts.push(`for the ${playerData.teams[0]}`);
      } else if (playerData.teams.length <= 3) {
        parts.push(`for teams like the ${playerData.teams.slice(0, 2).join(' and ')}`);
      } else {
        parts.push(`for teams including the ${playerData.teams[0]} and ${playerData.teams[1]}`);
      }
    }
    
    if (playerData.yearsActive) {
      parts.push(`from ${playerData.yearsActive}`);
    }
    
    if (playerData.achievements && playerData.achievements.length > 0) {
      parts.push(`and ${playerData.achievements[0].toLowerCase()}`);
    }
    
    return parts.join(' ');
  }
}