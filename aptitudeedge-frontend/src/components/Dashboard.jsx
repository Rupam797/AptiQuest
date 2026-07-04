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
        <div className="text-terminal-black font-label-mono text-sm uppercase tracking-widest animate-pulse">Loading stats...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Greeting Banner */}
      <div className="bg-white px-8 py-10 border-2 border-terminal-black pixel-corners shadow-[4px_4px_0px_#0F172A] space-y-4">
        <h1 className="text-3xl font-display-pixel uppercase text-terminal-black">Welcome back, {username}!</h1>
        <p className="text-ui-slate max-w-2xl text-sm font-body-md leading-relaxed">
          Ready to sharpen your aptitude today? Practice questions, review formulas, or take timed tests to evaluate your growth.
        </p>
        <div className="pt-2 flex gap-4">
          <Link to="/practice" className="bg-primary hover:bg-terminal-black text-white px-5 py-3 font-label-mono text-xs uppercase border-2 border-terminal-black pixel-corners shadow-[2px_2px_0px_#0F172A] transition-all">
            Start Practice
          </Link>
          <Link to="/tests" className="bg-white hover:bg-surface-container text-terminal-black px-5 py-3 font-label-mono text-xs uppercase border-2 border-terminal-black pixel-corners shadow-[2px_2px_0px_#0F172A] transition-all">
            Take a Test
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1 */}
        <div className="bg-white p-6 border-2 border-terminal-black pixel-corners shadow-[3px_3px_0px_#0F172A] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-label-mono font-bold text-ui-slate uppercase tracking-wider">Tests Completed</span>
            <div className="text-3xl font-display-pixel text-terminal-black">{stats.testsCompleted}</div>
          </div>
          <div className="bg-primary-container/10 text-primary p-3 border-2 border-terminal-black pixel-corners-sm">
            <span className="material-symbols-outlined text-2xl">task_alt</span>
          </div>
        </div>
        {/* Card 2 */}
        <div className="bg-white p-6 border-2 border-terminal-black pixel-corners shadow-[3px_3px_0px_#0F172A] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-label-mono font-bold text-ui-slate uppercase tracking-wider">Average Score</span>
            <div className="text-3xl font-display-pixel text-terminal-black">{stats.averageScore}%</div>
          </div>
          <div className="bg-primary-container/10 text-primary p-3 border-2 border-terminal-black pixel-corners-sm">
            <span className="material-symbols-outlined text-2xl">bolt</span>
          </div>
        </div>
        {/* Card 3 */}
        <div className="bg-white p-6 border-2 border-terminal-black pixel-corners shadow-[3px_3px_0px_#0F172A] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-label-mono font-bold text-ui-slate uppercase tracking-wider">Bookmarked Qs</span>
            <div className="text-3xl font-display-pixel text-terminal-black">{stats.bookmarksCount}</div>
          </div>
          <div className="bg-primary-container/10 text-primary p-3 border-2 border-terminal-black pixel-corners-sm">
            <span className="material-symbols-outlined text-2xl">star</span>
          </div>
        </div>
        {/* Card 4 */}
        <div className="bg-white p-6 border-2 border-terminal-black pixel-corners shadow-[3px_3px_0px_#0F172A] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-label-mono font-bold text-ui-slate uppercase tracking-wider">Available Questions</span>
            <div className="text-3xl font-display-pixel text-terminal-black">{stats.totalQuestions}</div>
          </div>
          <div className="bg-primary-container/10 text-primary p-3 border-2 border-terminal-black pixel-corners-sm">
            <span className="material-symbols-outlined text-2xl">menu_book</span>
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Recent Activity */}
        <div className="bg-white p-6 border-2 border-terminal-black pixel-corners shadow-[4px_4px_0px_#0F172A] md:col-span-2 space-y-4">
          <h2 className="text-xl font-display-pixel uppercase text-terminal-black">Recent Test Activity</h2>
          {history.length === 0 ? (
            <div className="text-center py-10 text-ui-slate font-label-mono text-sm uppercase">
              No recent attempts found. Start by taking your first test!
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((attempt) => (
                <div key={attempt.id} className="flex items-center justify-between border-2 border-terminal-black p-4 bg-white hover:bg-surface-container pixel-corners shadow-[2px_2px_0px_#0F172A] transition-all">
                  <div className="space-y-1">
                    <div className="font-bold text-terminal-black font-body-md">{attempt.testName}</div>
                    <div className="text-[10px] font-label-mono text-ui-slate uppercase">
                      Submitted: {new Date(attempt.submittedAt).toLocaleDateString(undefined, {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display-pixel text-lg text-terminal-black">{attempt.score} / {attempt.totalQuestions}</div>
                    <div className="text-[10px] font-label-mono text-primary font-bold uppercase">
                      {Math.round((attempt.score / attempt.totalQuestions) * 100)}% Correct
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links / Revision Tip */}
        <div className="bg-white p-6 border-2 border-terminal-black pixel-corners shadow-[4px_4px_0px_#0F172A] space-y-6">
          <h2 className="text-xl font-display-pixel uppercase text-terminal-black">Study Resources</h2>
          
          <div className="space-y-4">
            <Link to="/practice" className="flex items-center gap-4 p-4 border-2 border-terminal-black bg-white hover:bg-surface-container pixel-corners shadow-[2px_2px_0px_#0F172A] transition-all group">
              <span className="bg-primary text-white p-2 border border-terminal-black pixel-corners-sm">
                🎯
              </span>
              <div>
                <div className="font-bold font-body-md text-terminal-black">Practice Arena</div>
                <div className="text-[10px] font-label-mono text-ui-slate uppercase">Solve and view solutions</div>
              </div>
            </Link>

            <Link to="/revision" className="flex items-center gap-4 p-4 border-2 border-terminal-black bg-white hover:bg-surface-container pixel-corners shadow-[2px_2px_0px_#0F172A] transition-all group">
              <span className="bg-primary text-white p-2 border border-terminal-black pixel-corners-sm">
                ⚡
              </span>
              <div>
                <div className="font-bold font-body-md text-terminal-black">Revision Hub</div>
                <div className="text-[10px] font-label-mono text-ui-slate uppercase">Formulas & concept cards</div>
              </div>
            </Link>

            <Link to="/bookmarks" className="flex items-center gap-4 p-4 border-2 border-terminal-black bg-white hover:bg-surface-container pixel-corners shadow-[2px_2px_0px_#0F172A] transition-all group">
              <span className="bg-primary text-white p-2 border border-terminal-black pixel-corners-sm">
                ⭐
              </span>
              <div>
                <div className="font-bold font-body-md text-terminal-black">My Bookmarks</div>
                <div className="text-[10px] font-label-mono text-ui-slate uppercase">Review flagged questions</div>
              </div>
            </Link>
          </div>
          
          <div className="border-2 border-terminal-black p-4 bg-surface-container pixel-corners">
            <div className="font-label-mono font-bold text-xs text-terminal-black uppercase tracking-wider">Aptitude Hack</div>
            <div className="mt-2 text-xs text-ui-slate italic font-body-md leading-relaxed">
              "When solving Speed-Distance-Time problems, always ensure that your units are aligned. Keep all variables in km and hours, or in meters and seconds."
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
