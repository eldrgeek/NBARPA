import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WelcomePage } from './components/WelcomePage';
import { FivePillarsAssessment } from './components/FivePillarsAssessment';
import { AssessmentForm } from './components/AssessmentForm';
import { ConversationalAssessment } from './components/ConversationalAssessment';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-orange-600">
        <Routes>
          {/* Main Routes - Five Pillars Assessment is now primary */}
          <Route path="/" element={<FivePillarsAssessment />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/assessment" element={<FivePillarsAssessment />} />
          
          {/* Legacy Routes - Old assessments preserved but not primary */}
          <Route path="/legacy/assessment-form" element={<AssessmentForm />} />
          <Route path="/legacy/conversational-assessment" element={<ConversationalAssessment />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;