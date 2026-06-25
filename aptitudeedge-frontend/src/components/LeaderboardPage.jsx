import { useEffect, useState } from 'react';
import api from '../api';

function LeaderboardPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/leaderboard')
      .then((response) => setEntries(response.data || []))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-slate-600 font-semibold text-lg animate-pulse">Loading Leaderboard...</div>
      </div>
    );
  }

  const getRankBadge = (rank) => {
    if (rank === 1) return <span className="bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">🥇 1st Place</span>;
    if (rank === 2) return <span className="bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">🥈 2nd Place</span>;
    if (rank === 3) return <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">🥉 3rd Place</span>;
    return <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-full">{rank}th</span>;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-2 text-center">
        <h1 className="text-2xl font-black text-slate-900">Aptitude Leaderboard</h1>
        <p className="text-sm text-slate-500">Compete with fellow learners and rise to the top of the charts.</p>
      </div>

      {/* Leaderboard Table/List */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-4">
        {entries.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-sm">
            No rankings logged yet. Be the first to secure a spot!
          </div>
        ) : (
          <div className="space-y-3.5">
            {entries
              .sort((a, b) => b.score - a.score)
              .map((entry, index) => {
                const rank = index + 1;
                return (
                  <div key={index} className="flex items-center justify-between rounded-2xl border border-slate-50 px-5 py-4 hover:bg-slate-50/50 transition">
                    <div className="flex items-center gap-4">
                      {getRankBadge(rank)}
                      <div className="font-semibold text-slate-800 text-sm">{entry.username}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-extrabold text-slate-900 text-base">{entry.score}</div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Total Points</div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}

export default LeaderboardPage;
