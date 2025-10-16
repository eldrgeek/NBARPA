import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  Trash2, 
  RefreshCw, 
  Activity, 
  Users, 
  FileText, 
  Download,
  AlertTriangle,
  CheckCircle,
  Loader,
  BarChart3,
  Clock
} from 'lucide-react';
import {
  getAnalytics,
  getAssessments,
  getAdminLogs,
  clearAllData,
  clearCollection,
  collections,
  type Analytics,
  type Assessment,
  type AdminLog
} from '../lib/firebase';

export const AdminDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [clearTarget, setClearTarget] = useState<'all' | 'assessments' | 'players' | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [analyticsData, assessmentsData, logsData] = await Promise.all([
        getAnalytics(),
        getAssessments(20),
        getAdminLogs(50)
      ]);
      
      setAnalytics(analyticsData);
      setAssessments(assessmentsData);
      setAdminLogs(logsData);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = (target: 'all' | 'assessments' | 'players') => {
    setClearTarget(target);
    setShowConfirmation(true);
  };

  const confirmClear = async () => {
    if (!clearTarget) return;
    
    setClearing(true);
    setShowConfirmation(false);
    
    try {
      if (clearTarget === 'all') {
        await clearAllData();
      } else if (clearTarget === 'assessments') {
        await clearCollection(collections.assessments);
      } else if (clearTarget === 'players') {
        await clearCollection(collections.players);
      }
      
      // Reload data
      await loadData();
      alert(`Successfully cleared ${clearTarget === 'all' ? 'all data' : clearTarget}`);
    } catch (error) {
      console.error('Error clearing data:', error);
      alert('Failed to clear data. Check console for details.');
    } finally {
      setClearing(false);
      setClearTarget(null);
    }
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).format(date);
    } catch {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <Loader className="w-12 h-12 text-orange-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Database className="w-10 h-10 text-orange-400" />
            Admin Dashboard
          </h1>
          <p className="text-white/60">Monitor and manage NBA RPA database</p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-blue-400" />
              <span className="text-3xl font-bold text-white">
                {analytics?.total_players_connected || 0}
              </span>
            </div>
            <h3 className="text-white/80 font-semibold">Players Connected</h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between mb-4">
              <FileText className="w-8 h-8 text-green-400" />
              <span className="text-3xl font-bold text-white">
                {analytics?.total_assessments_taken || 0}
              </span>
            </div>
            <h3 className="text-white/80 font-semibold">Assessments Taken</h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-8 h-8 text-purple-400" />
              <span className="text-xl font-bold text-white">
                {analytics?.last_updated ? formatTimestamp(analytics.last_updated) : 'Never'}
              </span>
            </div>
            <h3 className="text-white/80 font-semibold">Last Updated</h3>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Trash2 className="w-6 h-6 text-red-400" />
            Database Actions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={loadData}
              disabled={clearing}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh Data
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleClearData('assessments')}
              disabled={clearing}
              className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-5 h-5" />
              Clear Assessments
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleClearData('players')}
              disabled={clearing}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-5 h-5" />
              Clear Players
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleClearData('all')}
              disabled={clearing}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <AlertTriangle className="w-5 h-5" />
              Clear All Data
            </motion.button>
          </div>
        </div>

        {/* Recent Assessments */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-green-400" />
            Recent Assessments ({assessments.length})
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-3 px-4 text-white/80 font-semibold">Player Name</th>
                  <th className="text-left py-3 px-4 text-white/80 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 text-white/80 font-semibold">Timestamp</th>
                  <th className="text-left py-3 px-4 text-white/80 font-semibold">ID</th>
                </tr>
              </thead>
              <tbody>
                {assessments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-white/60">
                      No assessments yet
                    </td>
                  </tr>
                ) : (
                  assessments.map((assessment) => (
                    <tr key={assessment.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 text-white">{assessment.player_name}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          assessment.status === 'completed' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {assessment.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-white/60">{formatTimestamp(assessment.timestamp)}</td>
                      <td className="py-3 px-4 text-white/40 text-xs font-mono">{assessment.id}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Admin Logs */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-400" />
            Admin Logs ({adminLogs.length})
          </h2>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {adminLogs.length === 0 ? (
              <p className="text-white/60 text-center py-8">No admin logs yet</p>
            ) : (
              adminLogs.map((log) => (
                <div key={log.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">{log.action_type}</span>
                    <span className="text-white/60 text-sm">{formatTimestamp(log.timestamp)}</span>
                  </div>
                  <div className="text-white/40 text-xs mt-1">
                    User: {log.user}
                    {log.details && ` • ${JSON.stringify(log.details)}`}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 border border-white/20 rounded-2xl p-8 max-w-md w-full"
            >
              <div className="text-center mb-6">
                <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Confirm Action</h3>
                <p className="text-white/80">
                  Are you sure you want to clear{' '}
                  <strong className="text-red-400">
                    {clearTarget === 'all' ? 'ALL DATA' : clearTarget}
                  </strong>
                  ? This action cannot be undone.
                </p>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowConfirmation(false);
                    setClearTarget(null);
                  }}
                  className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmClear}
                  className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors"
                >
                  Yes, Clear It
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Loading Overlay */}
        {clearing && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="text-center">
              <Loader className="w-16 h-16 text-orange-400 animate-spin mx-auto mb-4" />
              <p className="text-white text-xl font-semibold">Clearing data...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

