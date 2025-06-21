import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WelcomePage } from './components/WelcomePage';
import { AssessmentForm } from './components/AssessmentForm';
import { ConversationalAssessment } from './components/ConversationalAssessment';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-orange-600">
        <Routes>
          <Route path="/" element={<ConversationalAssessment />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/assessment" element={<AssessmentForm />} />
          <Route path="/conversational-assessment" element={<ConversationalAssessment />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;