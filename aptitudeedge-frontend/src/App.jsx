import { Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
    const loadUser = () => {
      const username = localStorage.getItem('username');
      const role = localStorage.getItem('role');
      const token = localStorage.getItem('token');
      if (token && username) {
        setUser({ username, role });
      } else {
        setUser(null);
      }
    };

    loadUser();
    window.addEventListener('auth-change', loadUser);
    return () => window.removeEventListener('auth-change', loadUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    window.dispatchEvent(new Event('auth-change'));
    navigate('/auth');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans flex flex-col">
      {/* Light Header */}
      <header className="bg-white text-slate-900 sticky top-0 z-50 shadow-sm border-b border-slate-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-extrabold text-emerald-650 tracking-tight">
              AptiQuest
            </Link>
            {user && (
              <nav className="hidden md:flex gap-1 text-sm font-medium text-slate-600">
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-xl transition ${isActive('/dashboard') ? 'bg-slate-100 text-slate-950 font-semibold' : 'hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/practice"
                  className={`px-3 py-2 rounded-xl transition ${isActive('/practice') ? 'bg-slate-100 text-slate-950 font-semibold' : 'hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  Practice Arena
                </Link>
                <Link
                  to="/revision"
                  className={`px-3 py-2 rounded-xl transition ${isActive('/revision') ? 'bg-slate-100 text-slate-950 font-semibold' : 'hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  Revision Hub
                </Link>
                <Link
                  to="/tests"
                  className={`px-3 py-2 rounded-xl transition ${isActive('/tests') ? 'bg-slate-100 text-slate-950 font-semibold' : 'hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  Test Center
                </Link>
                <Link
                  to="/bookmarks"
                  className={`px-3 py-2 rounded-xl transition ${isActive('/bookmarks') ? 'bg-slate-100 text-slate-950 font-semibold' : 'hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  Bookmarks
                </Link>
                <Link
                  to="/leaderboard"
                  className={`px-3 py-2 rounded-xl transition ${isActive('/leaderboard') ? 'bg-slate-100 text-slate-950 font-semibold' : 'hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  Leaderboard
                </Link>
                {user.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    className={`px-3 py-2 rounded-xl transition ${isActive('/admin') ? 'bg-slate-100 text-emerald-600 font-semibold' : 'hover:bg-slate-50 text-emerald-600'}`}
                  >
                    Admin Panel
                  </Link>
                )}
              </nav>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
                  {user.role}
                </span>
                <span className="text-sm text-slate-700 font-medium">{user.username}</span>
                <button
                  onClick={handleLogout}
                  className="text-xs font-semibold bg-red-50 text-red-650 hover:bg-red-100 px-3 py-1.5 rounded-xl border border-red-200 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition shadow-sm"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-6 py-8">
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
      
      <footer className="bg-white text-slate-400 text-center py-6 text-xs border-t border-slate-200">
        &copy; {new Date().getFullYear()} AptiQuest Portal. All rights reserved. Overhauled for Visual Excellence & Practice.
      </footer>
    </div>
  );
}

export default App;
