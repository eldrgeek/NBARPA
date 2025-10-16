import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, CheckCircle, XCircle, Loader, Search } from 'lucide-react';
import { 
  db, 
  saveAssessment, 
  getAnalytics, 
  getAssessments,
  searchPlayers 
} from '../lib/firebase';

export const DebugFirebase: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('Greg');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [manualPlayerName, setManualPlayerName] = useState('Greg Fauth');
  const [savingManual, setSavingManual] = useState(false);
  const [manualResult, setManualResult] = useState<string>('');

  const runTests = async () => {
    setTesting(true);
    const testResults: any[] = [];

    // Test 1: Check Firebase connection
    try {
      testResults.push({ 
        test: 'Firebase Connection', 
        status: db ? 'success' : 'error',
        message: db ? 'Connected' : 'Not connected'
      });
    } catch (error) {
      testResults.push({ 
        test: 'Firebase Connection', 
        status: 'error',
        message: String(error)
      });
    }

    // Test 2: Check Analytics
    try {
      const analytics = await getAnalytics();
      testResults.push({ 
        test: 'Analytics Retrieval', 
        status: analytics ? 'success' : 'error',
        message: analytics ? JSON.stringify(analytics, null, 2) : 'Failed'
      });
    } catch (error) {
      testResults.push({ 
        test: 'Analytics Retrieval', 
        status: 'error',
        message: String(error)
      });
    }

    // Test 3: Get Recent Assessments
    try {
      const assessments = await getAssessments(5);
      testResults.push({ 
        test: 'Recent Assessments', 
        status: 'success',
        message: `Found ${assessments.length} assessments\n${JSON.stringify(assessments.map(a => ({ 
          id: a.id, 
          name: a.player_name,
          timestamp: a.timestamp 
        })), null, 2)}`
      });
    } catch (error) {
      testResults.push({ 
        test: 'Recent Assessments', 
        status: 'error',
        message: String(error)
      });
    }

    // Test 4: Try to save a test assessment
    try {
      const testAssessment = {
        player_name: 'Test Player',
        timestamp: new Date(),
        assessment_data: { test: true },
        status: 'completed' as const
      };
      const id = await saveAssessment(testAssessment);
      testResults.push({ 
        test: 'Save Test Assessment', 
        status: id ? 'success' : 'error',
        message: id ? `Saved with ID: ${id}` : 'Failed to save'
      });
    } catch (error) {
      testResults.push({ 
        test: 'Save Test Assessment', 
        status: 'error',
        message: String(error)
      });
    }

    setResults(testResults);
    setTesting(false);
  };

  const handleSearch = async () => {
    const results = await searchPlayers(searchTerm);
    setSearchResults(results);
  };

  const saveManualAssessment = async () => {
    setSavingManual(true);
    setManualResult('');
    
    try {
      // Create a sample assessment with the entered player name
      const testAssessment: any = {
        player_name: manualPlayerName,
        // Don't include player_id if undefined - Firestore doesn't accept undefined values
        timestamp: new Date(),
        assessment_data: {
          name: manualPlayerName,
          date: new Date().toISOString().split('T')[0],
          emotionalState: ['Hopeful', 'Motivated'],
          fulfillment: 'Test assessment from debug console',
          activities: ['Test activity 1', 'Test activity 2', 'Test activity 3'],
          accomplishments: 'Test accomplishments',
          interests: ['Business/Entrepreneurship'],
          purpose: 'Test purpose',
          support: ['Family'],
          clarity: 7,
          supportNeeds: 'Test support needs'
        },
        status: 'completed' as const
      };
      
      console.log('Attempting to save assessment:', testAssessment);
      
      const id = await saveAssessment(testAssessment);
      
      if (id) {
        setManualResult(`✅ SUCCESS! Assessment saved with ID: ${id}\n\nNow check the Admin Dashboard to see if it appears in the Recent Assessments table.`);
        console.log('Assessment saved successfully with ID:', id);
      } else {
        setManualResult('❌ FAILED! saveAssessment returned null. Check browser console for errors.');
        console.error('saveAssessment returned null');
      }
    } catch (error) {
      setManualResult(`❌ ERROR: ${String(error)}\n\nCheck browser console for full error details.`);
      console.error('Error saving manual assessment:', error);
    } finally {
      setSavingManual(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Database className="w-10 h-10 text-orange-400" />
            Firebase Debug Console
          </h1>
          <p className="text-white/60">Test Firebase connectivity and data operations</p>
        </div>

        {/* Manual Assessment Submission */}
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-400/30 mb-6">
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <Database className="w-6 h-6 text-purple-400" />
            Manual Assessment Submission
          </h2>
          <p className="text-white/60 text-sm mb-4">Submit a test assessment directly to Firestore</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm mb-2">Player Name</label>
              <input
                type="text"
                value={manualPlayerName}
                onChange={(e) => setManualPlayerName(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                placeholder="Enter player name..."
              />
            </div>
            
            <button
              onClick={saveManualAssessment}
              disabled={savingManual || !manualPlayerName.trim()}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-purple-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {savingManual ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Saving Assessment...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Save Test Assessment
                </>
              )}
            </button>
            
            {manualResult && (
              <div className={`p-4 rounded-lg ${
                manualResult.includes('SUCCESS') 
                  ? 'bg-green-500/10 border border-green-500/30' 
                  : 'bg-red-500/10 border border-red-500/30'
              }`}>
                <pre className="text-sm text-white whitespace-pre-wrap font-mono">
                  {manualResult}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Search Players */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Search Players</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              placeholder="Search player name..."
            />
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Search
            </button>
          </div>
          
          {searchResults.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-white/60 text-sm">Found {searchResults.length} players:</p>
              {searchResults.map((player: any) => (
                <div key={player.player_id} className="p-2 bg-white/5 rounded text-white text-sm">
                  {player.full_name} {player.position && `(${player.position})`}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Run Tests Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={runTests}
          disabled={testing}
          className="w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 mb-6"
        >
          {testing ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Running Tests...
            </>
          ) : (
            <>
              <Database className="w-5 h-5" />
              Run Diagnostic Tests
            </>
          )}
        </motion.button>

        {/* Test Results */}
        {results.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Test Results</h2>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.status === 'success' 
                      ? 'bg-green-500/10 border-green-500/30' 
                      : 'bg-red-500/10 border-red-500/30'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {result.status === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                    <h3 className="font-semibold text-white">{result.test}</h3>
                  </div>
                  <pre className="text-sm text-white/80 font-mono overflow-x-auto">
                    {result.message}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Environment Info */}
        <div className="mt-6 bg-white/5 rounded-xl p-4 border border-white/10">
          <h3 className="text-white font-semibold mb-2">Environment Info</h3>
          <div className="text-white/60 text-sm space-y-1">
            <p>Firebase Project: {import.meta.env.VITE_FIREBASE_PROJECT_ID || 'Not set'}</p>
            <p>API Key: {import.meta.env.VITE_FIREBASE_API_KEY ? '✓ Set' : '✗ Not set'}</p>
            <p>Auth Domain: {import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'Not set'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

