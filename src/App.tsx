import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ScrollToTop } from './components/ScrollToTop';
import { TourProvider } from './contexts/TourContext';
import { PillarProgressProvider } from './contexts/PillarProgressContext';
import { Navigation } from './components/Navigation';
import { RPALanding } from './components/RPALanding';
import { TourModal } from './components/TourModal';
import { WelcomePage } from './components/WelcomePage';
import { FivePillarsAssessment } from './components/FivePillarsAssessment';
import { AssessmentForm } from './components/AssessmentForm';
import { ConversationalAssessment } from './components/ConversationalAssessment';
import { ActivePlayerPage } from './pages/ActivePlayerPage';
import { RetiredPlayerPage } from './pages/RetiredPlayerPage';
import { FamilyMemberPage } from './pages/FamilyMemberPage';
import { BusinessPartnerPage } from './pages/BusinessPartnerPage';
import { FanSupporterPage } from './pages/FanSupporterPage';
import { PillarCamaraderieePage } from './pages/PillarCamaraderieePage';
import { PillarHealthPage } from './pages/PillarHealthPage';
import { PillarFinancePage } from './pages/PillarFinancePage';
import { PillarCommunityPage } from './pages/PillarCommunityPage';
import { PillarFamilyPage } from './pages/PillarFamilyPage';
import { FivePillarsPage } from './pages/FivePillarsPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { GalleryPage } from './pages/GalleryPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    // TODO: Implement actual login logic
    setIsLoggedIn(true);
    console.log('Login initiated');
  };

  const handleLogout = () => {
    // TODO: Implement actual logout logic
    setIsLoggedIn(false);
    console.log('Logout initiated');
  };

  return (
    <Router>
      <TourProvider>
        <PillarProgressProvider>
          <ScrollToTop />
          <TourModal />
          <Navigation 
            isLoggedIn={isLoggedIn}
            onLogin={handleLogin}
            onLogout={handleLogout}
          />
          <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-orange-600">
          <Routes>
            <Route path="/" element={<RPALanding />} />
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path="/assessment" element={<FivePillarsAssessment />} />
            <Route path="/legacy/assessment-form" element={<AssessmentForm />} />
            <Route path="/legacy/conversational-assessment" element={<ConversationalAssessment />} />
            <Route path="/active-player" element={<ActivePlayerPage />} />
            <Route path="/retired-player" element={<RetiredPlayerPage />} />
            <Route path="/family" element={<FamilyMemberPage />} />
            <Route path="/business" element={<BusinessPartnerPage />} />
            <Route path="/fan" element={<FanSupporterPage />} />
            <Route path="/five-pillars" element={<FivePillarsPage />} />
            <Route path="/pillars/camaraderie" element={<PillarCamaraderieePage />} />
            <Route path="/pillars/health" element={<PillarHealthPage />} />
            <Route path="/pillars/finance" element={<PillarFinancePage />} />
            <Route path="/pillars/community" element={<PillarCommunityPage />} />
            <Route path="/pillars/family" element={<PillarFamilyPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:postId" element={<BlogPostPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
          </Routes>
        </div>
        </PillarProgressProvider>
      </TourProvider>
    </Router>
  );
}

export default App;