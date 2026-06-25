import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function Dashboard() {
  const [stats, setStats] = useState({
    testsCompleted: 0,
    averageScore: 0,
    bookmarksCount: 0,
    totalQuestions: 0,
  });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [historyRes, bookmarksRes, questionsRes] = await Promise.all([
          api.get('/tests/history'),
          api.get('/bookmarks'),
          api.get('/questions'),
        ]);

        const historyData = historyRes.data;
        const bookmarksData = bookmarksRes.data;
        const questionsData = questionsRes.data;

        // Calculate statistics
        const completed = historyData.length;
        let avg = 0;
        if (completed > 0) {
          const sum = historyData.reduce((acc, attempt) => acc + (attempt.score / attempt.totalQuestions), 0);
          avg = Math.round((sum / completed) * 100);
        }

        setStats({
          testsCompleted: completed,
          averageScore: avg,
          bookmarksCount: bookmarksData.length,
          totalQuestions: questionsData.length,
        });
        setHistory(historyData.slice(0, 5)); // Keep last 5 attempts
      } catch (error) {
        console.error('Error fetching dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const username = localStorage.getItem('username') || 'Aptitude Learner';

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-slate-600 font-semibold text-lg animate-pulse">Loading stats...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Greeting Banner (Light Theme) */}
      <div className="rounded-2xl bg-white px-8 py-10 text-slate-900 border border-slate-200 shadow-sm space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">Welcome back, {username}!</h1>
        <p className="text-slate-500 max-w-lg text-sm leading-relaxed">
          Ready to sharpen your aptitude today? Practice questions, review formulas, or take timed tests to evaluate your growth.
        </p>
        <div className="pt-4 flex gap-3">
          <Link to="/practice" className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition duration-150">
            Start Practice
          </Link>
          <Link to="/tests" className="bg-white hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-lg font-semibold text-sm border border-slate-200 transition duration-150">
            Take a Test
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tests Completed</span>
            <div className="text-3xl font-extrabold text-slate-900">{stats.testsCompleted}</div>
          </div>
          <div className="bg-blue-50 text-blue-600 p-3.5 rounded-2xl">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
        </div>
        {/* Card 2 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Score</span>
            <div className="text-3xl font-extrabold text-slate-900">{stats.averageScore}%</div>
          </div>
          <div className="bg-emerald-50 text-emerald-600 p-3.5 rounded-2xl">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
        {/* Card 3 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Bookmarked Qs</span>
            <div className="text-3xl font-extrabold text-slate-900">{stats.bookmarksCount}</div>
          </div>
          <div className="bg-amber-50 text-amber-600 p-3.5 rounded-2xl">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
        </div>
        {/* Card 4 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Available Questions</span>
            <div className="text-3xl font-extrabold text-slate-900">{stats.totalQuestions}</div>
          </div>
          <div className="bg-purple-50 text-purple-600 p-3.5 rounded-2xl">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 md:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Recent Test Activity</h2>
          {history.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-sm">
              No recent attempts found. Start by taking your first aptitude test!
            </div>
          ) : (
            <div className="space-y-3.5">
              {history.map((attempt) => (
                <div key={attempt.id} className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-4 hover:bg-slate-50 transition">
                  <div className="space-y-1">
                    <div className="font-semibold text-slate-800">{attempt.testName}</div>
                    <div className="text-xs text-slate-500">
                      Submitted: {new Date(attempt.submittedAt).toLocaleDateString(undefined, {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-slate-900">{attempt.score} / {attempt.totalQuestions}</div>
                    <div className="text-xs text-emerald-600 font-semibold">
                      {Math.round((attempt.score / attempt.totalQuestions) * 100)}% Correct
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links / Revision Tip */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Study Resources</h2>
          
          <div className="space-y-4 text-sm">
            <Link to="/practice" className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-emerald-50/50 hover:border-emerald-200 transition group">
              <span className="bg-emerald-100 text-emerald-600 p-2 rounded-xl group-hover:bg-emerald-200 transition">
                🎯
              </span>
              <div>
                <div className="font-semibold text-slate-800">Practice Arena</div>
                <div className="text-xs text-slate-500">Practice and read solutions</div>
              </div>
            </Link>

            <Link to="/revision" className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-blue-50/50 hover:border-blue-200 transition group">
              <span className="bg-blue-100 text-blue-600 p-2 rounded-xl group-hover:bg-blue-200 transition">
                ⚡
              </span>
              <div>
                <div className="font-semibold text-slate-800">Revision Hub</div>
                <div className="text-xs text-slate-500">Formulas, tips & concepts</div>
              </div>
            </Link>

            <Link to="/bookmarks" className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-amber-50/50 hover:border-amber-200 transition group">
              <span className="bg-amber-100 text-amber-600 p-2 rounded-xl group-hover:bg-amber-200 transition">
                ⭐
              </span>
              <div>
                <div className="font-semibold text-slate-800">My Bookmarks</div>
                <div className="text-xs text-slate-500">Review saved questions</div>
              </div>
            </Link>
          </div>
          
          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-150">
            <div className="font-semibold text-xs text-slate-500 uppercase tracking-wider">Aptitude Hack</div>
            <div className="mt-2 text-xs text-slate-700 italic leading-relaxed">
              "When solving Speed-Distance-Time problems, always ensure that your units are aligned. Keep all variables in km and hours, or in meters and seconds."
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
