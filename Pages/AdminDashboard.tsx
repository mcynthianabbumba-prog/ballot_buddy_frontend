import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import CreateOfficerModal from '../components/users/CreateOfficerModal';
import OfficerDetailsModal from '../components/users/OfficerDetailsModal';
import CreatePositionModal from '../components/positions/CreatePositionModal';
import PositionsListModal from '../components/positions/PositionsListModal';
import CandidatesListModal from '../components/candidates/CandidatesListModal';
import ImportVotersModal from '../components/voters/ImportVotersModal';
import VotersListModal from '../components/voters/VotersListModal';
import AuditLogModal from '../components/audit/AuditLogModal';
import ExportReportsModal from '../components/reports/ExportReportsModal';
import { usersAPI, positionsAPI, candidatesAPI, votersAPI, reportsAPI } from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [welcomeMessage, setWelcomeMessage] = useState<string | null>(null);
  const [isCreateOfficerOpen, setIsCreateOfficerOpen] = useState(false);
  const [isOfficerDetailsOpen, setIsOfficerDetailsOpen] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState<any | null>(null);
  const [isCreatePositionOpen, setIsCreatePositionOpen] = useState(false);
  const [isPositionsListOpen, setIsPositionsListOpen] = useState(false);
  const [isCandidatesListOpen, setIsCandidatesListOpen] = useState(false);
  const [isImportVotersOpen, setIsImportVotersOpen] = useState(false);
  const [isVotersListOpen, setIsVotersListOpen] = useState(false);
  const [isAuditLogOpen, setIsAuditLogOpen] = useState(false);
  const [isExportReportsOpen, setIsExportReportsOpen] = useState(false);
  const [officers, setOfficers] = useState<any[]>([]);
  const [stats, setStats] = useState({
    positions: 0,
    candidates: 0,
    voters: 0,
    votes: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for welcome message from login
    const welcomeData = localStorage.getItem('welcomeMessage');
    if (welcomeData) {
      try {
        const welcome = JSON.parse(welcomeData);
        // Show welcome message if it's recent (within last 30 seconds)
        if (Date.now() - welcome.timestamp < 30000) {
          setWelcomeMessage(welcome.message);
          // Auto-remove after 10 seconds
          setTimeout(() => {
            setWelcomeMessage(null);
            localStorage.removeItem('welcomeMessage');
          }, 10000);
        } else {
          localStorage.removeItem('welcomeMessage');
        }
      } catch (e) {
        localStorage.removeItem('welcomeMessage');
      }
    }
    
    // Load data
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load officers
      const allUsers = await usersAPI.getAll();
      const officersList = allUsers.filter((u: any) => u.role === 'OFFICER');
      setOfficers(officersList);

      // Load stats - always fetch fresh from backend, no caching
      const [positions, candidates, votersResponse, turnoutData] = await Promise.all([
        positionsAPI.getAll().catch(() => []),
        candidatesAPI.getAll().catch(() => []),
        votersAPI.getAll().catch(() => ({ voters: [], pagination: { total: 0 } })),
        reportsAPI.getTurnout().catch(() => ({ votesCast: 0 })),
      ]);

      // Set stats from backend response only - no fallback values
      setStats({
        positions: Array.isArray(positions) ? positions.length : 0,
        candidates: Array.isArray(candidates) ? candidates.length : 0,
        voters: votersResponse?.pagination?.total ?? (Array.isArray(votersResponse?.voters) ? votersResponse.voters.length : 0),
        votes: turnoutData?.votesCast ?? 0,
      });
      
      console.log('Dashboard stats loaded from backend:', {
        positions: positions.length,
        candidates: candidates.length,
        voters: votersResponse?.pagination?.total || votersResponse?.voters?.length || 0,
        votes: turnoutData?.votesCast || 0,
      });
    } catch (err) {
      console.error('Failed to load data:', err);
      // On error, reset to zero
      setStats({
        positions: 0,
        candidates: 0,
        voters: 0,
        votes: 0,
      });
      setOfficers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOfficerClick = (officer: any) => {
    setSelectedOfficer(officer);
    setIsOfficerDetailsOpen(true);
  };

  const handleNavAction = (action: string) => {
    switch (action) {
      case 'open-positions-list':
        setIsPositionsListOpen(true);
        break;
      case 'open-candidates-list':
        setIsCandidatesListOpen(true);
        break;
      case 'open-voters-list':
        setIsVotersListOpen(true);
        break;
      case 'open-officers-list':
        // Focus on officers section - could scroll or open modal
        break;
      case 'open-audit-log':
        setIsAuditLogOpen(true);
        break;
      default:
        break;
    }
  };

  // Handle hash-based navigation
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      switch (hash) {
        case '#positions':
          setIsPositionsListOpen(true);
          break;
        case '#candidates':
          setIsCandidatesListOpen(true);
          break;
        case '#voters':
          setIsVotersListOpen(true);
          break;
        case '#officers':
          // Could scroll to officers section
          break;
        case '#audit':
          setIsAuditLogOpen(true);
          break;
      }
      // Clear hash after opening modal
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  return (
    <DashboardLayout
      role="ADMIN"
      title="Admin Dashboard"
      subtitle="Manage your voting system"
      onNavAction={handleNavAction}
    >
      {welcomeMessage && (
        <div className="mb-6 p-4 bg-pink-600 text-white rounded-2xl shadow-lg flex items-center justify-between animate-fade-in-up">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 flex-shrink-0">
              <span className="text-2xl">👑</span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-bold mb-1 truncate">{welcomeMessage}</h3>
              <p className="text-xs text-pink-100">You're all set! Start managing your voting system.</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setWelcomeMessage(null)}
            className="text-white hover:bg-white/20 rounded-full h-8 w-8 p-0 flex-shrink-0"
          >
            ✕
          </Button>
        </div>
      )}

      {/* Beautiful Stats Overview */}
      <div className="mb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-3xl">📊</span>
            Overview
          </h2>
          <p className="text-sm text-gray-500 mt-1">Key metrics at a glance</p>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card 
            className="group cursor-pointer border-2 border-pink-200 bg-gradient-to-br from-white to-pink-50/30 hover:border-pink-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1" 
            onClick={() => setIsPositionsListOpen(true)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-4xl">📋</div>
                <div className="h-10 w-10 rounded-xl bg-pink-100 group-hover:bg-pink-200 flex items-center justify-center transition-colors">
                  <svg className="h-5 w-5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <CardTitle className="text-sm font-semibold text-gray-600 mb-1">Election Positions</CardTitle>
              <p className="text-3xl font-bold text-pink-600">{loading ? '...' : stats.positions}</p>
            </CardHeader>
          </Card>

          <Card 
            className="group cursor-pointer border-2 border-pink-200 bg-gradient-to-br from-white to-pink-50/30 hover:border-pink-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1" 
            onClick={() => setIsCandidatesListOpen(true)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-4xl">👥</div>
                <div className="h-10 w-10 rounded-xl bg-pink-100 group-hover:bg-pink-200 flex items-center justify-center transition-colors">
                  <svg className="h-5 w-5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <CardTitle className="text-sm font-semibold text-gray-600 mb-1">Candidates</CardTitle>
              <p className="text-3xl font-bold text-pink-600">{loading ? '...' : stats.candidates}</p>
            </CardHeader>
          </Card>

          <Card 
            className="group cursor-pointer border-2 border-pink-200 bg-gradient-to-br from-white to-pink-50/30 hover:border-pink-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1" 
            onClick={() => setIsVotersListOpen(true)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-4xl">🗳️</div>
                <div className="h-10 w-10 rounded-xl bg-pink-100 group-hover:bg-pink-200 flex items-center justify-center transition-colors">
                  <svg className="h-5 w-5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <CardTitle className="text-sm font-semibold text-gray-600 mb-1">Total Voters</CardTitle>
              <p className="text-3xl font-bold text-pink-600">{loading ? '...' : stats.voters.toLocaleString()}</p>
            </CardHeader>
          </Card>

          <Card 
            className="group border-2 border-pink-200 bg-gradient-to-br from-white to-pink-50/30 hover:border-pink-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-4xl">✅</div>
                <div className="h-10 w-10 rounded-xl bg-pink-100 flex items-center justify-center">
                  <svg className="h-5 w-5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <CardTitle className="text-sm font-semibold text-gray-600 mb-1">Votes Cast</CardTitle>
              <p className="text-3xl font-bold text-pink-600">{loading ? '...' : stats.votes}</p>
            </CardHeader>
          </Card>
        </div>
      </div>

        {/* Main Content Sections */}
        <div className="space-y-8">
          {/* Election Management Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Election Management</h2>
                <p className="text-sm text-gray-500">Configure positions and manage candidates</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <button
                onClick={() => setIsCreatePositionOpen(true)}
                className="group relative overflow-hidden bg-white border-2 border-pink-200 rounded-3xl p-8 hover:border-pink-400 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-left"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700 opacity-50"></div>
                <div className="relative z-10">
                  <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">✨</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">
                    Create Position
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">Add a new election position to your ballot</p>
                  <div className="flex items-center text-pink-600 font-semibold text-sm">
                    <span>Get Started</span>
                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setIsPositionsListOpen(true)}
                className="group relative overflow-hidden bg-white border-2 border-pink-200 rounded-3xl p-8 hover:border-pink-400 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-left"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700 opacity-50"></div>
                <div className="relative z-10">
                  <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">⚙️</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">
                    Manage Positions
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">Update voting times and position settings</p>
                  <div className="flex items-center text-pink-600 font-semibold text-sm">
                    <span>Configure</span>
                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setIsCandidatesListOpen(true)}
                className="group relative overflow-hidden bg-white border-2 border-pink-200 rounded-3xl p-8 hover:border-pink-400 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-left"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700 opacity-50"></div>
                <div className="relative z-10">
                  <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">🎭</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">
                    Manage Candidates
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">Review and approve candidate nominations</p>
                  <div className="flex items-center text-pink-600 font-semibold text-sm">
                    <span>Review All</span>
                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Voters & Officers Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Voters Management */}
            <Card className="border-2 border-pink-200 bg-white overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-br from-pink-50 via-pink-50/50 to-white border-b-2 border-pink-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg">
                    <span className="text-3xl">🗳️</span>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold text-gray-900">Voters Management</CardTitle>
                    <CardDescription className="text-sm mt-1">Import and manage your voter database</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <button
                    onClick={() => setIsImportVotersOpen(true)}
                    className="w-full group flex items-center justify-between p-5 border-2 border-pink-200 rounded-2xl hover:border-pink-400 hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 transition-all duration-300 hover:shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-pink-100 group-hover:bg-pink-200 flex items-center justify-center transition-colors">
                        <span className="text-2xl">📤</span>
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold text-gray-900 group-hover:text-pink-600 transition-colors">Import Voters</h4>
                        <p className="text-xs text-gray-500 mt-1">Upload CSV file with voter data</p>
                      </div>
                    </div>
                    <svg className="w-6 h-6 text-gray-400 group-hover:text-pink-600 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <button
                    onClick={() => setIsVotersListOpen(true)}
                    className="w-full group flex items-center justify-between p-5 border-2 border-pink-200 rounded-2xl hover:border-pink-400 hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 transition-all duration-300 hover:shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-pink-100 group-hover:bg-pink-200 flex items-center justify-center transition-colors">
                        <span className="text-2xl">👀</span>
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold text-gray-900 group-hover:text-pink-600 transition-colors">View All Voters</h4>
                        <p className="text-xs text-gray-500 mt-1">Browse and search voter database</p>
                      </div>
                    </div>
                    <svg className="w-6 h-6 text-gray-400 group-hover:text-pink-600 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Returning Officers */}
            <Card className="border-2 border-pink-200 bg-white overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-br from-pink-50 via-pink-50/50 to-white border-b-2 border-pink-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg">
                      <span className="text-3xl">👔</span>
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">Returning Officers</CardTitle>
                      <CardDescription className="text-sm mt-1">Manage your election team</CardDescription>
                    </div>
                  </div>
                  <div className="h-10 px-4 rounded-full bg-pink-100 flex items-center justify-center">
                    <span className="text-sm font-bold text-pink-600">{officers.length}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <svg className="animate-spin h-10 w-10 text-pink-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                ) : officers.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">👤</div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">No officers yet</p>
                    <p className="text-xs text-gray-500 mb-6">Create your first returning officer to get started</p>
                    <Button 
                      size="sm"
                      onClick={() => setIsCreateOfficerOpen(true)}
                      className="bg-pink-600 hover:bg-pink-700 text-white shadow-md hover:shadow-lg transition-all"
                    >
                      <span className="mr-2">➕</span>
                      Create First Officer
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {officers.map((officer) => (
                      <div 
                        key={officer.id} 
                        className="group p-4 border-2 border-pink-200 rounded-2xl hover:border-pink-400 hover:shadow-lg transition-all duration-300 cursor-pointer bg-white hover:bg-pink-50/30"
                        onClick={() => handleOfficerClick(officer)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                            {officer.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-gray-900 truncate group-hover:text-pink-600 transition-colors">{officer.name}</p>
                            <p className="text-xs text-gray-500 truncate mt-1">{officer.email}</p>
                          </div>
                          <svg className="h-6 w-6 text-gray-400 group-hover:text-pink-600 group-hover:translate-x-1 flex-shrink-0 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => setIsCreateOfficerOpen(true)}
                  className="w-full mt-4 p-4 border-2 border-dashed border-pink-300 rounded-2xl hover:border-pink-400 hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 transition-all duration-300 flex items-center justify-center gap-3 text-pink-600 font-bold hover:shadow-md"
                >
                  <span className="text-2xl">➕</span>
                  <span>Add New Officer</span>
                </button>
              </CardContent>
            </Card>
          </div>

          {/* Reports & Analytics Section */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg">
                <span className="text-2xl">📈</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
                <p className="text-sm text-gray-500">View insights and system activity</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <button
                onClick={() => setIsExportReportsOpen(true)}
                className="group relative overflow-hidden bg-white border-2 border-pink-200 rounded-3xl p-8 hover:border-pink-400 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-left"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700 opacity-50"></div>
                <div className="relative z-10">
                  <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">📊</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">
                    Export Reports
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">Download comprehensive election analytics and data</p>
                  <div className="flex items-center text-pink-600 font-semibold text-sm">
                    <span>View Reports</span>
                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setIsAuditLogOpen(true)}
                className="group relative overflow-hidden bg-white border-2 border-pink-200 rounded-3xl p-8 hover:border-pink-400 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-left"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700 opacity-50"></div>
                <div className="relative z-10">
                  <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">📜</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">
                    Audit Log
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">Track all system activities and changes</p>
                  <div className="flex items-center text-pink-600 font-semibold text-sm">
                    <span>View History</span>
                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

      <CreateOfficerModal
        isOpen={isCreateOfficerOpen}
        onClose={() => setIsCreateOfficerOpen(false)}
        onSuccess={() => {
          loadData();
        }}
      />
      <OfficerDetailsModal
        isOpen={isOfficerDetailsOpen}
        onClose={() => {
          setIsOfficerDetailsOpen(false);
          setSelectedOfficer(null);
        }}
        officer={selectedOfficer}
        onDeleted={() => {
          loadData();
        }}
        onStatusChanged={() => {
          loadData();
        }}
      />
      <CreatePositionModal
        isOpen={isCreatePositionOpen}
        onClose={() => setIsCreatePositionOpen(false)}
        onSuccess={() => {
          loadData();
        }}
      />
      <PositionsListModal
        isOpen={isPositionsListOpen}
        onClose={() => setIsPositionsListOpen(false)}
        onPositionDeleted={() => {
          loadData();
        }}
        onSuccess={loadData}
      />
      <CandidatesListModal
        isOpen={isCandidatesListOpen}
        onClose={() => setIsCandidatesListOpen(false)}
        onCandidateDeleted={() => {
          loadData();
        }}
        onSuccess={loadData}
      />
      <ImportVotersModal
        isOpen={isImportVotersOpen}
        onClose={() => setIsImportVotersOpen(false)}
        onSuccess={() => {
          loadData();
        }}
      />
      <VotersListModal
        isOpen={isVotersListOpen}
        onClose={() => setIsVotersListOpen(false)}
      />
      <AuditLogModal
        isOpen={isAuditLogOpen}
        onClose={() => setIsAuditLogOpen(false)}
      />
      <ExportReportsModal
        isOpen={isExportReportsOpen}
        onClose={() => setIsExportReportsOpen(false)}
      />
    </DashboardLayout>
  );
};

export default AdminDashboard;
