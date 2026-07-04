import { Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from './api';
import AuthPage from './components/AuthPage';
import QuestionsPage from './components/QuestionsPage';
import LeaderboardPage from './components/LeaderboardPage';
import BookmarkPage from './components/BookmarkPage';
import Dashboard from './components/Dashboard';
import FormulasPage from './components/FormulasPage';
import TestCenterPage from './components/TestCenterPage';
import TestArenaPage from './components/TestArenaPage';
import TestResultPage from './components/TestResultPage';
import AdminDashboard from './components/AdminDashboard';
import LandingPage from './components/LandingPage';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser({ username: res.data.username, role: res.data.role });
        } catch (err) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    fetchUser();
    window.addEventListener('auth-change', fetchUser);
    return () => window.removeEventListener('auth-change', fetchUser);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error("Logout request failed", e);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      window.dispatchEvent(new Event('auth-change'));
      navigate('/auth');
    }
  };

  const isActive = (path) => location.pathname === path;
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-surface text-on-surface font-sans flex flex-col">
      {/* Light Header */}
      {!isHomePage && (
        <header className="bg-primary-container text-white sticky top-0 z-50 border-b-2 border-terminal-black shadow-[0_2px_0px_#0F172A]">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-2xl font-display-pixel tracking-tighter text-white uppercase flex items-center gap-2 hover:opacity-85 transition-opacity">
                <span className="w-3 h-3 bg-white block shrink-0"></span>
                AptiQuest
              </Link>
              {user && (
                <nav className="hidden md:flex gap-1.5 text-sm font-medium">
                  <Link
                    to="/dashboard"
                    className={`px-3.5 py-1.5 font-label-mono text-xs uppercase transition border-2 pixel-corners-sm ${isActive('/dashboard') ? 'bg-white text-primary border-terminal-black shadow-[2px_2px_0px_#0F172A] font-bold' : 'border-transparent text-white/80 hover:bg-white/10 hover:text-white'}`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/practice"
                    className={`px-3.5 py-1.5 font-label-mono text-xs uppercase transition border-2 pixel-corners-sm ${isActive('/practice') ? 'bg-white text-primary border-terminal-black shadow-[2px_2px_0px_#0F172A] font-bold' : 'border-transparent text-white/80 hover:bg-white/10 hover:text-white'}`}
                  >
                    Practice Arena
                  </Link>
                  <Link
                    to="/revision"
                    className={`px-3.5 py-1.5 font-label-mono text-xs uppercase transition border-2 pixel-corners-sm ${isActive('/revision') ? 'bg-white text-primary border-terminal-black shadow-[2px_2px_0px_#0F172A] font-bold' : 'border-transparent text-white/80 hover:bg-white/10 hover:text-white'}`}
                  >
                    Revision Hub
                  </Link>
                  <Link
                    to="/tests"
                    className={`px-3.5 py-1.5 font-label-mono text-xs uppercase transition border-2 pixel-corners-sm ${isActive('/tests') ? 'bg-white text-primary border-terminal-black shadow-[2px_2px_0px_#0F172A] font-bold' : 'border-transparent text-white/80 hover:bg-white/10 hover:text-white'}`}
                  >
                    Test Center
                  </Link>
                  <Link
                    to="/bookmarks"
                    className={`px-3.5 py-1.5 font-label-mono text-xs uppercase transition border-2 pixel-corners-sm ${isActive('/bookmarks') ? 'bg-white text-primary border-terminal-black shadow-[2px_2px_0px_#0F172A] font-bold' : 'border-transparent text-white/80 hover:bg-white/10 hover:text-white'}`}
                  >
                    Bookmarks
                  </Link>
                  <Link
                    to="/leaderboard"
                    className={`px-3.5 py-1.5 font-label-mono text-xs uppercase transition border-2 pixel-corners-sm ${isActive('/leaderboard') ? 'bg-white text-primary border-terminal-black shadow-[2px_2px_0px_#0F172A] font-bold' : 'border-transparent text-white/80 hover:bg-white/10 hover:text-white'}`}
                  >
                    Leaderboard
                  </Link>
                  {user.role === 'ADMIN' && (
                    <Link
                      to="/admin"
                      className={`px-3.5 py-1.5 font-label-mono text-xs uppercase transition border-2 pixel-corners-sm ${isActive('/admin') ? 'bg-white text-primary border-terminal-black shadow-[2px_2px_0px_#0F172A] font-bold' : 'border-transparent text-white/80 hover:bg-white/10 hover:text-white'}`}
                    >
                      Admin
                    </Link>
                  )}
                </nav>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-white/15 text-white font-label-mono px-2 py-0.5 border border-white/30 uppercase">
                      {user.role}
                    </span>
                    <span className="text-sm font-label-mono text-white/90 font-medium">{user.username}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-xs font-label-mono bg-red-600 text-white hover:bg-red-700 px-3.5 py-1.5 border-2 border-terminal-black pixel-corners-sm shadow-[2px_2px_0px_#0F172A] transition-all"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="bg-primary text-white text-xs font-label-mono uppercase px-4 py-2 border-2 border-terminal-black pixel-corners-sm shadow-[2px_2px_0px_#0F172A] hover:bg-white hover:text-primary transition-all"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className={`flex-grow ${isHomePage ? 'w-full' : 'mx-auto w-full max-w-7xl px-6 py-10'}`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <AuthPage />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/auth" />} />
          <Route path="/practice" element={user ? <QuestionsPage /> : <Navigate to="/auth" />} />
          <Route path="/revision" element={user ? <FormulasPage /> : <Navigate to="/auth" />} />
          <Route path="/tests" element={user ? <TestCenterPage /> : <Navigate to="/auth" />} />
          <Route path="/tests/take/:id" element={user ? <TestArenaPage /> : <Navigate to="/auth" />} />
          <Route path="/tests/result" element={user ? <TestResultPage /> : <Navigate to="/auth" />} />
          <Route path="/bookmarks" element={user ? <BookmarkPage /> : <Navigate to="/auth" />} />
          <Route path="/leaderboard" element={user ? <LeaderboardPage /> : <Navigate to="/auth" />} />
          <Route path="/admin" element={user && user.role === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/auth" />} />
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      
      {!isHomePage && (
        <footer className="bg-terminal-black text-white/50 text-center py-6 text-xs border-t-2 border-terminal-black font-label-mono uppercase tracking-wider">
          &copy; {new Date().getFullYear()} AptiQuest Portal. All rights reserved.
        </footer>
      )}
    </div>
  );
}

export default App;
