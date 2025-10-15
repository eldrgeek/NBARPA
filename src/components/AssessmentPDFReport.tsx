import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  coverPage: {
    padding: 40,
    backgroundColor: '#1a1a2e',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#ff6b35',
    marginBottom: 20,
    textAlign: 'center',
  },
  coverSubtitle: {
    fontSize: 24,
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
  },
  coverName: {
    fontSize: 32,
    color: '#ffffff',
    marginBottom: 40,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  coverDate: {
    fontSize: 12,
    color: '#cccccc',
    marginTop: 60,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 20,
    borderBottomWidth: 3,
    borderBottomColor: '#ff6b35',
    paddingBottom: 10,
  },
  pillarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 10,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  scoreLabel: {
    fontSize: 12,
    color: '#666666',
    width: 150,
  },
  scoreBar: {
    flex: 1,
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    backgroundColor: '#ff6b35',
  },
  scoreText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 10,
    width: 40,
  },
  strengthsSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    marginBottom: 15,
  },
  improvementSection: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#fff3e0',
    borderRadius: 8,
    marginBottom: 15,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1a1a2e',
  },
  bulletPoint: {
    fontSize: 11,
    marginBottom: 8,
    paddingLeft: 15,
    color: '#333333',
    lineHeight: 1.6,
  },
  responseText: {
    fontSize: 10,
    color: '#555555',
    lineHeight: 1.5,
    marginBottom: 10,
    fontStyle: 'italic',
  },
  executiveSummary: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 12,
    color: '#333333',
    lineHeight: 1.8,
    marginBottom: 10,
  },
  actionPlan: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
  },
  actionItem: {
    fontSize: 11,
    marginBottom: 10,
    paddingLeft: 15,
    color: '#1565c0',
    lineHeight: 1.6,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    color: '#999999',
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 10,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 40,
    fontSize: 10,
    color: '#999999',
  },
});

interface AssessmentData {
  name: string;
  q0_emotional_state: string[];
  q0_career_fulfillment: string;
  q0_personal_interests: string[];
  q0_future_goals: string;
  q0_areas_of_interest: string[];
  q0_purpose_definition: string;
  q0_support_system: string[];
  q0_clarity: number;
  q0_support_needs: string;
  q1_connection: number;
  q2_player_connection: string;
  q3_reach_out_frequency: string;
  q4_connection_barriers: string[];
  q5_brotherhood_moment: string;
  q6_physical_health: number;
  q7_health_attention: string[];
  q8_health_motivation: string[];
  q9_health_routine: string;
  q10_healthy_habit: string;
  q11_financial_confidence: number;
  q12_financial_area: string[];
  q13_has_advisor: string;
  q13_advisor_satisfaction: number;
  q14_review_frequency: string;
  q15_financial_milestone: string;
  q16_community_involvement: number;
  q17_community_impact: string[];
  q18_community_frequency: string[];
  q19_community_barriers: string[];
  q20_positive_change: string;
  q21_work_life_balance: number;
  q22_biggest_supporter: string;
  q23_family_challenge: string[];
  q24_family_activities: string;
  q25_family_goal: string;
}

// Analysis functions
const analyzeCamaraderie = (data: AssessmentData) => {
  const strengths: string[] = [];
  const improvements: string[] = [];
  const score = data.q1_connection;

  if (score >= 7) {
    strengths.push(`Strong sense of connection to the RPA network (${score}/10)`);
  }
  if (data.q3_reach_out_frequency === 'Weekly' || data.q3_reach_out_frequency === 'Monthly') {
    strengths.push(`Actively engaging with fellow players ${data.q3_reach_out_frequency.toLowerCase()}`);
  }
  if (data.q2_player_connection) {
    strengths.push(`Values ${data.q2_player_connection.toLowerCase()} with fellow players`);
  }

  if (score <= 5) {
    improvements.push(`Consider increasing connection with the RPA network (current: ${score}/10)`);
  }
  if (data.q3_reach_out_frequency === 'Rarely' || data.q3_reach_out_frequency === 'Never') {
    improvements.push('Increase frequency of outreach to former teammates and players');
  }
  if (data.q4_connection_barriers.length > 0) {
    improvements.push(`Address barriers: ${data.q4_connection_barriers.slice(0, 2).join(', ')}`);
  }

  return { strengths, improvements, score };
};

const analyzeHealth = (data: AssessmentData) => {
  const strengths: string[] = [];
  const improvements: string[] = [];
  const score = data.q6_physical_health;

  if (score >= 7) {
    strengths.push(`Excellent physical health rating (${score}/10)`);
  }
  if (data.q9_health_routine === 'Daily' || data.q9_health_routine === 'Several times a week') {
    strengths.push(`Consistent health routine: ${data.q9_health_routine.toLowerCase()}`);
  }
  if (data.q8_health_motivation.length > 0) {
    strengths.push(`Clear health motivations including ${data.q8_health_motivation[0].toLowerCase()}`);
  }

  if (score <= 5) {
    improvements.push(`Focus on improving physical health (current: ${score}/10)`);
  }
  if (data.q9_health_routine === 'Rarely' || data.q9_health_routine === 'Never') {
    improvements.push('Establish a more consistent health and fitness routine');
  }
  if (data.q7_health_attention.length > 0) {
    improvements.push(`Priority areas: ${data.q7_health_attention.slice(0, 2).join(', ')}`);
  }

  return { strengths, improvements, score };
};

const analyzeFinance = (data: AssessmentData) => {
  const strengths: string[] = [];
  const improvements: string[] = [];
  const score = data.q11_financial_confidence;

  if (score >= 7) {
    strengths.push(`Strong financial confidence (${score}/10)`);
  }
  if (data.q13_has_advisor === 'Yes') {
    strengths.push('Working with a financial advisor');
    if (data.q13_advisor_satisfaction >= 7) {
      strengths.push(`High satisfaction with advisor (${data.q13_advisor_satisfaction}/10)`);
    }
  }
  if (data.q14_review_frequency === 'Monthly' || data.q14_review_frequency === 'Quarterly') {
    strengths.push(`Regular financial review: ${data.q14_review_frequency.toLowerCase()}`);
  }

  if (score <= 5) {
    improvements.push(`Build financial confidence (current: ${score}/10)`);
  }
  if (data.q13_has_advisor === 'No') {
    improvements.push('Consider working with a qualified financial advisor');
  }
  if (data.q12_financial_area.length > 0) {
    improvements.push(`Focus areas: ${data.q12_financial_area.slice(0, 2).join(', ')}`);
  }

  return { strengths, improvements, score };
};

const analyzeCommunity = (data: AssessmentData) => {
  const strengths: string[] = [];
  const improvements: string[] = [];
  const score = data.q16_community_involvement;

  if (score >= 7) {
    strengths.push(`High community involvement (${score}/10)`);
  }
  if (data.q17_community_impact.length > 0) {
    strengths.push(`Active in ${data.q17_community_impact[0].toLowerCase()}`);
  }
  if (data.q18_community_frequency.includes('Monthly') || data.q18_community_frequency.includes('Quarterly')) {
    strengths.push('Regular participation in community events');
  }

  if (score <= 5) {
    improvements.push(`Increase community engagement (current: ${score}/10)`);
  }
  if (data.q19_community_barriers.length > 0) {
    improvements.push(`Address barriers: ${data.q19_community_barriers.slice(0, 2).join(', ')}`);
  }
  if (!data.q18_community_frequency.includes('Monthly') && !data.q18_community_frequency.includes('Quarterly')) {
    improvements.push('Establish regular community involvement schedule');
  }

  return { strengths, improvements, score };
};

const analyzeFamily = (data: AssessmentData) => {
  const strengths: string[] = [];
  const improvements: string[] = [];
  const score = data.q21_work_life_balance;

  if (score >= 7) {
    strengths.push(`Excellent work-life balance (${score}/10)`);
  }
  if (data.q22_biggest_supporter) {
    strengths.push(`Strong support from ${data.q22_biggest_supporter.toLowerCase()}`);
  }
  if (data.q24_family_activities === 'Weekly' || data.q24_family_activities === 'Monthly') {
    strengths.push(`Regular family activities: ${data.q24_family_activities.toLowerCase()}`);
  }

  if (score <= 5) {
    improvements.push(`Improve work-life balance (current: ${score}/10)`);
  }
  if (data.q23_family_challenge.length > 0) {
    improvements.push(`Address challenges: ${data.q23_family_challenge.slice(0, 2).join(', ')}`);
  }
  if (data.q24_family_activities === 'Rarely' || data.q24_family_activities === 'Never') {
    improvements.push('Establish regular family activities and traditions');
  }

  return { strengths, improvements, score };
};

const ScoreBar: React.FC<{ label: string; score: number; color: string }> = ({ label, score, color }) => (
  <View style={styles.scoreContainer}>
    <Text style={styles.scoreLabel}>{label}</Text>
    <View style={styles.scoreBar}>
      <View style={[styles.scoreBarFill, { width: `${score * 10}%`, backgroundColor: color }]} />
    </View>
    <Text style={[styles.scoreText, { color }]}>{score}/10</Text>
  </View>
);

// PDF Document Component
const AssessmentPDF: React.FC<{ data: AssessmentData }> = ({ data }) => {
  const camaraderieAnalysis = analyzeCamaraderie(data);
  const healthAnalysis = analyzeHealth(data);
  const financeAnalysis = analyzeFinance(data);
  const communityAnalysis = analyzeCommunity(data);
  const familyAnalysis = analyzeFamily(data);

  const averageScore = Math.round(
    (camaraderieAnalysis.score + healthAnalysis.score + financeAnalysis.score + 
     communityAnalysis.score + familyAnalysis.score) / 5
  );

  const allStrengths = [
    ...camaraderieAnalysis.strengths,
    ...healthAnalysis.strengths,
    ...financeAnalysis.strengths,
    ...communityAnalysis.strengths,
    ...familyAnalysis.strengths,
  ];

  const allImprovements = [
    ...camaraderieAnalysis.improvements,
    ...healthAnalysis.improvements,
    ...financeAnalysis.improvements,
    ...communityAnalysis.improvements,
    ...familyAnalysis.improvements,
  ];

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.coverPage}>
        <Text style={styles.coverTitle}>Five Pillars</Text>
        <Text style={styles.coverTitle}>Transition Assessment</Text>
        <Text style={styles.coverSubtitle}>Personalized Report for</Text>
        <Text style={styles.coverName}>{data.name}</Text>
        <Text style={styles.coverDate}>{new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</Text>
        <Text style={[styles.coverDate, { marginTop: 20 }]}>
          NBA Retired Players Association
        </Text>
      </Page>

      {/* Executive Summary */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Executive Summary</Text>
        
        <View style={styles.executiveSummary}>
          <Text style={[styles.summaryText, { fontWeight: 'bold', fontSize: 14, marginBottom: 15 }]}>
            Overall Transition Readiness: {averageScore}/10
          </Text>
          <Text style={styles.summaryText}>
            {data.name}, this assessment provides a comprehensive view of your transition journey across 
            the Five Pillars framework developed by Antonio Davis and the NBA Retired Players Association.
          </Text>
          <Text style={styles.summaryText}>
            Your responses reveal {allStrengths.length} key strengths and {allImprovements.length} areas 
            for focused development. This personalized report will guide you through each pillar with 
            specific insights and actionable recommendations.
          </Text>
        </View>

        <Text style={[styles.pillarTitle, { marginTop: 20, marginBottom: 20 }]}>Five Pillars Overview</Text>
        
        <ScoreBar label="Camaraderie" score={camaraderieAnalysis.score} color="#ff6b35" />
        <ScoreBar label="Health" score={healthAnalysis.score} color="#4caf50" />
        <ScoreBar label="Finance" score={financeAnalysis.score} color="#ffc107" />
        <ScoreBar label="Community" score={communityAnalysis.score} color="#9c27b0" />
        <ScoreBar label="Family" score={familyAnalysis.score} color="#2196f3" />

        <Text style={styles.footer}>
          NBA Retired Players Association | RPA Connect | Confidential Assessment Report
        </Text>
        <Text style={styles.pageNumber}>Page 1</Text>
      </Page>

      {/* Camaraderie Pillar */}
      <Page size="A4" style={styles.page}>
        <Text style={[styles.sectionTitle, { borderBottomColor: '#ff6b35' }]}>
          🤝 Pillar 1: Camaraderie
        </Text>
        
        <View style={{ marginBottom: 20 }}>
          <Text style={[styles.summaryText, { marginBottom: 15 }]}>
            Connection Score: {camaraderieAnalysis.score}/10
          </Text>
          <Text style={styles.summaryText}>
            Camaraderie represents the bonds you share with fellow players and the strength of your 
            connections within the basketball community.
          </Text>
        </View>

        {camaraderieAnalysis.strengths.length > 0 && (
          <View style={styles.strengthsSection}>
            <Text style={[styles.sectionHeader, { color: '#2e7d32' }]}>✓ Your Strengths</Text>
            {camaraderieAnalysis.strengths.map((strength, idx) => (
              <Text key={idx} style={styles.bulletPoint}>• {strength}</Text>
            ))}
          </View>
        )}

        {camaraderieAnalysis.improvements.length > 0 && (
          <View style={styles.improvementSection}>
            <Text style={[styles.sectionHeader, { color: '#e65100' }]}>⚡ Areas for Growth</Text>
            {camaraderieAnalysis.improvements.map((improvement, idx) => (
              <Text key={idx} style={styles.bulletPoint}>• {improvement}</Text>
            ))}
          </View>
        )}

        {data.q5_brotherhood_moment && (
          <View style={{ marginTop: 15 }}>
            <Text style={[styles.sectionHeader, { marginBottom: 5 }]}>Your Brotherhood Memory:</Text>
            <Text style={styles.responseText}>"{data.q5_brotherhood_moment}"</Text>
          </View>
        )}

        <View style={styles.actionPlan}>
          <Text style={[styles.sectionHeader, { color: '#1565c0' }]}>🎯 Recommended Actions</Text>
          {camaraderieAnalysis.score <= 5 && (
            <Text style={styles.actionItem}>
              • Reach out to 2-3 former teammates this month to reconnect
            </Text>
          )}
          {data.q4_connection_barriers.includes('No clear way to reconnect') && (
            <Text style={styles.actionItem}>
              • Explore RPA Connect platform to find and engage with fellow players
            </Text>
          )}
          <Text style={styles.actionItem}>
            • Consider joining a player alumni event or virtual meetup
          </Text>
        </View>

        <Text style={styles.footer}>
          NBA Retired Players Association | RPA Connect | Confidential Assessment Report
        </Text>
        <Text style={styles.pageNumber}>Page 2</Text>
      </Page>

      {/* Health Pillar */}
      <Page size="A4" style={styles.page}>
        <Text style={[styles.sectionTitle, { borderBottomColor: '#4caf50' }]}>
          💪 Pillar 2: Health
        </Text>
        
        <View style={{ marginBottom: 20 }}>
          <Text style={[styles.summaryText, { marginBottom: 15 }]}>
            Physical Health Score: {healthAnalysis.score}/10
          </Text>
          <Text style={styles.summaryText}>
            Your health pillar encompasses physical fitness, mental wellness, nutrition, and overall 
            wellbeing as you transition from professional athletics.
          </Text>
        </View>

        {healthAnalysis.strengths.length > 0 && (
          <View style={styles.strengthsSection}>
            <Text style={[styles.sectionHeader, { color: '#2e7d32' }]}>✓ Your Strengths</Text>
            {healthAnalysis.strengths.map((strength, idx) => (
              <Text key={idx} style={styles.bulletPoint}>• {strength}</Text>
            ))}
          </View>
        )}

        {healthAnalysis.improvements.length > 0 && (
          <View style={styles.improvementSection}>
            <Text style={[styles.sectionHeader, { color: '#e65100' }]}>⚡ Areas for Growth</Text>
            {healthAnalysis.improvements.map((improvement, idx) => (
              <Text key={idx} style={styles.bulletPoint}>• {improvement}</Text>
            ))}
          </View>
        )}

        {data.q10_healthy_habit && (
          <View style={{ marginTop: 15 }}>
            <Text style={[styles.sectionHeader, { marginBottom: 5 }]}>Your Health Goal for This Year:</Text>
            <Text style={styles.responseText}>"{data.q10_healthy_habit}"</Text>
          </View>
        )}

        <View style={styles.actionPlan}>
          <Text style={[styles.sectionHeader, { color: '#1565c0' }]}>🎯 Recommended Actions</Text>
          {healthAnalysis.score <= 5 && (
            <Text style={styles.actionItem}>
              • Schedule a comprehensive physical with a sports medicine specialist
            </Text>
          )}
          {data.q7_health_attention.includes('Mental health') && (
            <Text style={styles.actionItem}>
              • Connect with RPA's mental health resources and support network
            </Text>
          )}
          {(data.q9_health_routine === 'Rarely' || data.q9_health_routine === 'Never') && (
            <Text style={styles.actionItem}>
              • Establish a weekly health routine with specific, achievable goals
            </Text>
          )}
          <Text style={styles.actionItem}>
            • Consider working with a transition-focused fitness coach
          </Text>
        </View>

        <Text style={styles.footer}>
          NBA Retired Players Association | RPA Connect | Confidential Assessment Report
        </Text>
        <Text style={styles.pageNumber}>Page 3</Text>
      </Page>

      {/* Finance Pillar */}
      <Page size="A4" style={styles.page}>
        <Text style={[styles.sectionTitle, { borderBottomColor: '#ffc107' }]}>
          💰 Pillar 3: Finance
        </Text>
        
        <View style={{ marginBottom: 20 }}>
          <Text style={[styles.summaryText, { marginBottom: 15 }]}>
            Financial Confidence Score: {financeAnalysis.score}/10
          </Text>
          <Text style={styles.summaryText}>
            Financial security and planning are crucial for a successful transition. This pillar 
            evaluates your confidence and preparation for long-term financial wellbeing.
          </Text>
        </View>

        {financeAnalysis.strengths.length > 0 && (
          <View style={styles.strengthsSection}>
            <Text style={[styles.sectionHeader, { color: '#2e7d32' }]}>✓ Your Strengths</Text>
            {financeAnalysis.strengths.map((strength, idx) => (
              <Text key={idx} style={styles.bulletPoint}>• {strength}</Text>
            ))}
          </View>
        )}

        {financeAnalysis.improvements.length > 0 && (
          <View style={styles.improvementSection}>
            <Text style={[styles.sectionHeader, { color: '#e65100' }]}>⚡ Areas for Growth</Text>
            {financeAnalysis.improvements.map((improvement, idx) => (
              <Text key={idx} style={styles.bulletPoint}>• {improvement}</Text>
            ))}
          </View>
        )}

        {data.q15_financial_milestone && (
          <View style={{ marginTop: 15 }}>
            <Text style={[styles.sectionHeader, { marginBottom: 5 }]}>Financial Milestone You're Proud Of:</Text>
            <Text style={styles.responseText}>"{data.q15_financial_milestone}"</Text>
          </View>
        )}

        <View style={styles.actionPlan}>
          <Text style={[styles.sectionHeader, { color: '#1565c0' }]}>🎯 Recommended Actions</Text>
          {data.q13_has_advisor === 'No' && (
            <Text style={styles.actionItem}>
              • Connect with RPA's vetted financial advisors who specialize in athlete transitions
            </Text>
          )}
          {financeAnalysis.score <= 5 && (
            <Text style={styles.actionItem}>
              • Schedule a financial planning session to address immediate concerns
            </Text>
          )}
          {data.q12_financial_area.includes('Legacy and estate planning') && (
            <Text style={styles.actionItem}>
              • Consult with an estate planning attorney to secure your family's future
            </Text>
          )}
          <Text style={styles.actionItem}>
            • Attend RPA's financial literacy workshops and webinars
          </Text>
        </View>

        <Text style={styles.footer}>
          NBA Retired Players Association | RPA Connect | Confidential Assessment Report
        </Text>
        <Text style={styles.pageNumber}>Page 4</Text>
      </Page>

      {/* Community Pillar */}
      <Page size="A4" style={styles.page}>
        <Text style={[styles.sectionTitle, { borderBottomColor: '#9c27b0' }]}>
          🌟 Pillar 4: Community
        </Text>
        
        <View style={{ marginBottom: 20 }}>
          <Text style={[styles.summaryText, { marginBottom: 15 }]}>
            Community Involvement Score: {communityAnalysis.score}/10
          </Text>
          <Text style={styles.summaryText}>
            Giving back and staying connected to your community creates purpose and impact beyond 
            your playing career.
          </Text>
        </View>

        {communityAnalysis.strengths.length > 0 && (
          <View style={styles.strengthsSection}>
            <Text style={[styles.sectionHeader, { color: '#2e7d32' }]}>✓ Your Strengths</Text>
            {communityAnalysis.strengths.map((strength, idx) => (
              <Text key={idx} style={styles.bulletPoint}>• {strength}</Text>
            ))}
          </View>
        )}

        {communityAnalysis.improvements.length > 0 && (
          <View style={styles.improvementSection}>
            <Text style={[styles.sectionHeader, { color: '#e65100' }]}>⚡ Areas for Growth</Text>
            {communityAnalysis.improvements.map((improvement, idx) => (
              <Text key={idx} style={styles.bulletPoint}>• {improvement}</Text>
            ))}
          </View>
        )}

        {data.q20_positive_change && (
          <View style={{ marginTop: 15 }}>
            <Text style={[styles.sectionHeader, { marginBottom: 5 }]}>Your Vision for Positive Change:</Text>
            <Text style={styles.responseText}>"{data.q20_positive_change}"</Text>
          </View>
        )}

        <View style={styles.actionPlan}>
          <Text style={[styles.sectionHeader, { color: '#1565c0' }]}>🎯 Recommended Actions</Text>
          {communityAnalysis.score <= 5 && (
            <Text style={styles.actionItem}>
              • Identify one cause or organization that aligns with your values
            </Text>
          )}
          {data.q19_community_barriers.includes('No organized opportunities') && (
            <Text style={styles.actionItem}>
              • Explore RPA's community programs and partnership opportunities
            </Text>
          )}
          {data.q17_community_impact.includes('Youth mentorship') && (
            <Text style={styles.actionItem}>
              • Connect with local youth programs or basketball camps in your area
            </Text>
          )}
          <Text style={styles.actionItem}>
            • Set a goal to participate in one community event per quarter
          </Text>
        </View>

        <Text style={styles.footer}>
          NBA Retired Players Association | RPA Connect | Confidential Assessment Report
        </Text>
        <Text style={styles.pageNumber}>Page 5</Text>
      </Page>

      {/* Family Pillar */}
      <Page size="A4" style={styles.page}>
        <Text style={[styles.sectionTitle, { borderBottomColor: '#2196f3' }]}>
          ❤️ Pillar 5: Family
        </Text>
        
        <View style={{ marginBottom: 20 }}>
          <Text style={[styles.summaryText, { marginBottom: 15 }]}>
            Work-Life Balance Score: {familyAnalysis.score}/10
          </Text>
          <Text style={styles.summaryText}>
            Family relationships and work-life balance are foundational to a fulfilling life after 
            basketball. This pillar examines your connections and priorities.
          </Text>
        </View>

        {familyAnalysis.strengths.length > 0 && (
          <View style={styles.strengthsSection}>
            <Text style={[styles.sectionHeader, { color: '#2e7d32' }]}>✓ Your Strengths</Text>
            {familyAnalysis.strengths.map((strength, idx) => (
              <Text key={idx} style={styles.bulletPoint}>• {strength}</Text>
            ))}
          </View>
        )}

        {familyAnalysis.improvements.length > 0 && (
          <View style={styles.improvementSection}>
            <Text style={[styles.sectionHeader, { color: '#e65100' }]}>⚡ Areas for Growth</Text>
            {familyAnalysis.improvements.map((improvement, idx) => (
              <Text key={idx} style={styles.bulletPoint}>• {improvement}</Text>
            ))}
          </View>
        )}

        {data.q25_family_goal && (
          <View style={{ marginTop: 15 }}>
            <Text style={[styles.sectionHeader, { marginBottom: 5 }]}>Your Family Goal for This Year:</Text>
            <Text style={styles.responseText}>"{data.q25_family_goal}"</Text>
          </View>
        )}

        <View style={styles.actionPlan}>
          <Text style={[styles.sectionHeader, { color: '#1565c0' }]}>🎯 Recommended Actions</Text>
          {familyAnalysis.score <= 5 && (
            <Text style={styles.actionItem}>
              • Have an open conversation with family about transition goals and expectations
            </Text>
          )}
          {data.q23_family_challenge.includes('Communication') && (
            <Text style={styles.actionItem}>
              • Consider family counseling or communication workshops
            </Text>
          )}
          {(data.q24_family_activities === 'Rarely' || data.q24_family_activities === 'Never') && (
            <Text style={styles.actionItem}>
              • Schedule weekly family time and establish meaningful traditions
            </Text>
          )}
          <Text style={styles.actionItem}>
            • Connect with RPA's family support resources and programs
          </Text>
        </View>

        <Text style={styles.footer}>
          NBA Retired Players Association | RPA Connect | Confidential Assessment Report
        </Text>
        <Text style={styles.pageNumber}>Page 6</Text>
      </Page>

      {/* Transition & Purpose Summary */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Transition & Purpose Insights</Text>
        
        <View style={{ marginBottom: 20 }}>
          <Text style={[styles.pillarTitle, { color: '#1a1a2e' }]}>Your Emotional Journey</Text>
          <Text style={styles.summaryText}>
            Current emotional state: {data.q0_emotional_state.join(', ')}
          </Text>
          <Text style={styles.summaryText}>
            Clarity about next steps: {data.q0_clarity}/10
          </Text>
        </View>

        {data.q0_purpose_definition && (
          <View style={{ marginBottom: 20 }}>
            <Text style={[styles.sectionHeader, { marginBottom: 5 }]}>How You Define Purpose Now:</Text>
            <Text style={styles.responseText}>"{data.q0_purpose_definition}"</Text>
          </View>
        )}

        {data.q0_areas_of_interest.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <Text style={[styles.sectionHeader, { marginBottom: 10 }]}>Areas You're Exploring:</Text>
            {data.q0_areas_of_interest.map((area, idx) => (
              <Text key={idx} style={styles.bulletPoint}>• {area}</Text>
            ))}
          </View>
        )}

        {data.q0_support_system.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <Text style={[styles.sectionHeader, { marginBottom: 10 }]}>Your Support System:</Text>
            {data.q0_support_system.map((support, idx) => (
              <Text key={idx} style={styles.bulletPoint}>• {support}</Text>
            ))}
          </View>
        )}

        <View style={styles.actionPlan}>
          <Text style={[styles.sectionHeader, { color: '#1565c0' }]}>🎯 Next Steps for Your Transition</Text>
          {data.q0_clarity <= 5 && (
            <Text style={styles.actionItem}>
              • Schedule a one-on-one session with an RPA transition coach
            </Text>
          )}
          <Text style={styles.actionItem}>
            • Connect with RPA members who have successfully transitioned in your areas of interest
          </Text>
          <Text style={styles.actionItem}>
            • Attend RPA's quarterly transition workshops and networking events
          </Text>
          <Text style={styles.actionItem}>
            • Revisit this assessment in 6 months to track your progress
          </Text>
        </View>

        <Text style={styles.footer}>
          NBA Retired Players Association | RPA Connect | Confidential Assessment Report
        </Text>
        <Text style={styles.pageNumber}>Page 7</Text>
      </Page>

      {/* Final Summary & Next Steps */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Your Personalized Action Plan</Text>
        
        <View style={styles.executiveSummary}>
          <Text style={[styles.summaryText, { fontWeight: 'bold', fontSize: 13, marginBottom: 12 }]}>
            {data.name}, Your Journey Forward
          </Text>
          <Text style={styles.summaryText}>
            This assessment reveals that you have {allStrengths.length} significant strengths to build upon 
            and {allImprovements.length} focused areas for development. Your overall transition readiness 
            score of {averageScore}/10 provides a baseline for measuring your progress.
          </Text>
        </View>

        <Text style={[styles.pillarTitle, { marginTop: 25, marginBottom: 15 }]}>Top 5 Strengths to Leverage:</Text>
        {allStrengths.slice(0, 5).map((strength, idx) => (
          <Text key={idx} style={styles.bulletPoint}>
            {idx + 1}. {strength}
          </Text>
        ))}

        <Text style={[styles.pillarTitle, { marginTop: 25, marginBottom: 15 }]}>Top 5 Priority Areas:</Text>
        {allImprovements.slice(0, 5).map((improvement, idx) => (
          <Text key={idx} style={styles.bulletPoint}>
            {idx + 1}. {improvement}
          </Text>
        ))}

        <View style={[styles.actionPlan, { marginTop: 25 }]}>
          <Text style={[styles.sectionHeader, { color: '#1565c0', marginBottom: 12 }]}>
            🎯 Your 30-Day Action Plan
          </Text>
          <Text style={styles.actionItem}>
            Week 1: Review this report and share it with your RPA transition coach
          </Text>
          <Text style={styles.actionItem}>
            Week 2: Take action on your highest-priority pillar
          </Text>
          <Text style={styles.actionItem}>
            Week 3: Connect with 2-3 RPA members who can support your goals
          </Text>
          <Text style={styles.actionItem}>
            Week 4: Set measurable goals for each pillar for the next 90 days
          </Text>
        </View>

        <View style={{ marginTop: 30, padding: 15, backgroundColor: '#f0f0f0', borderRadius: 8 }}>
          <Text style={[styles.summaryText, { fontWeight: 'bold', marginBottom: 8 }]}>
            Remember:
          </Text>
          <Text style={styles.summaryText}>
            Transition is a journey, not a destination. The RPA community is here to support you 
            every step of the way. Your basketball career was extraordinary—your next chapter can be too.
          </Text>
        </View>

        <Text style={[styles.footer, { borderTopWidth: 0, marginTop: 30 }]}>
          For support and resources, contact: support@nbrpa.com | www.legendsofbasketball.com
        </Text>
        <Text style={[styles.footer, { marginTop: 5 }]}>
          NBA Retired Players Association | RPA Connect | Confidential Assessment Report
        </Text>
        <Text style={styles.pageNumber}>Page 8</Text>
      </Page>
    </Document>
  );
};

// Component to trigger PDF download
export const PDFReportButton: React.FC<{ data: AssessmentData }> = ({ data }) => {
  return (
    <PDFDownloadLink
      document={<AssessmentPDF data={data} />}
      fileName={`${data.name.replace(/\s+/g, '_')}_Five_Pillars_Assessment.pdf`}
    >
      {({ loading }) => (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          <Download className="w-5 h-5" />
          {loading ? 'Generating PDF...' : 'Download PDF Report'}
        </motion.button>
      )}
    </PDFDownloadLink>
  );
};

export default AssessmentPDF;

