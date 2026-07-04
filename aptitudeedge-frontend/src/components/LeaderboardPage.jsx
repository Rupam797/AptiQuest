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
        <div className="text-terminal-black font-label-mono text-sm uppercase tracking-widest animate-pulse">Loading Leaderboard...</div>
      </div>
    );
  }

  const getRankBadge = (rank) => {
    if (rank === 1) return <span className="bg-amber-400 text-terminal-black border-2 border-terminal-black text-[10px] font-label-mono font-bold px-3 py-1 pixel-corners shadow-[1px_1px_0px_#000] uppercase">🥇 1st Place</span>;
    if (rank === 2) return <span className="bg-slate-300 text-terminal-black border-2 border-terminal-black text-[10px] font-label-mono font-bold px-3 py-1 pixel-corners shadow-[1px_1px_0px_#000] uppercase">🥈 2nd Place</span>;
    if (rank === 3) return <span className="bg-orange-300 text-terminal-black border-2 border-terminal-black text-[10px] font-label-mono font-bold px-3 py-1 pixel-corners shadow-[1px_1px_0px_#000] uppercase">🥉 3rd Place</span>;
    return <span className="bg-white-container text-terminal-black border border-terminal-black text-[10px] font-label-mono px-3 py-1 pixel-corners-sm uppercase">{rank}th</span>;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-6 md:p-8 border-2 border-terminal-black pixel-corners shadow-[4px_4px_0px_#0F172A] space-y-2 text-center">
        <h1 className="text-2xl font-display-pixel uppercase text-terminal-black">Aptitude Leaderboard</h1>
        <p className="text-xs font-label-mono text-ui-slate uppercase">Compete with fellow learners and rise to the top of the charts.</p>
      </div>

      {/* Leaderboard Table/List */}
      <div className="bg-white p-6 md:p-8 border-2 border-terminal-black pixel-corners shadow-[4px_4px_0px_#0F172A] space-y-4">
        {entries.length === 0 ? (
          <div className="text-center py-10 text-ui-slate font-label-mono text-sm uppercase">
            No rankings logged yet. Be the first to secure a spot!
          </div>
        ) : (
          <div className="space-y-4">
            {entries
              .sort((a, b) => b.score - a.score)
              .map((entry, index) => {
                const rank = index + 1;
                return (
                  <div key={index} className="flex items-center justify-between border-2 border-terminal-black p-4 bg-white hover:bg-surface-container pixel-corners shadow-[2px_2px_0px_#0F172A] transition-all">
                    <div className="flex items-center gap-4">
                      {getRankBadge(rank)}
                      <div className="font-bold text-terminal-black font-body-md">{entry.username}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-display-pixel text-lg text-terminal-black">{entry.score}</div>
                      <div className="text-[9px] font-label-mono text-ui-slate uppercase tracking-wider font-bold">Total Points</div>
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
