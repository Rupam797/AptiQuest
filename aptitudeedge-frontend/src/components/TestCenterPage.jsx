import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function TestCenterPage() {
  const [tests, setTests] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTestsAndHistory = async () => {
      try {
        const [testsRes, historyRes] = await Promise.all([
          api.get('/tests'),
          api.get('/tests/history'),
        ]);
        setTests(testsRes.data || []);
        setHistory(historyRes.data || []);
      } catch (err) {
        console.error('Error fetching tests data', err);
      } finally {
        setLoading(false);
      }
    };

    loadTestsAndHistory();
  }, []);

  const handleStartTest = (testId) => {
    navigate(`/tests/take/${testId}`);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-terminal-black font-label-mono text-sm uppercase tracking-widest animate-pulse">Loading Test Center...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-white p-6 md:p-8 border-2 border-terminal-black pixel-corners shadow-[4px_4px_0px_#0F172A] space-y-2">
        <h1 className="text-2xl font-display-pixel uppercase text-terminal-black">Test Center</h1>
        <p className="text-xs font-label-mono text-ui-slate uppercase">Put your skills to the test under timed conditions to simulate real-world exams.</p>
      </div>

      {/* Available Tests Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-display-pixel uppercase text-terminal-black">Available Tests</h2>
        {tests.length === 0 ? (
          <div className="bg-white p-10 border-2 border-terminal-black text-center text-ui-slate font-label-mono uppercase pixel-corners">
            No tests have been configured by the admin yet.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tests.map((test) => (
              <div key={test.id} className="bg-white p-6 border-2 border-terminal-black pixel-corners shadow-[3px_3px_0px_#0F172A] hover:shadow-[4px_4px_0px_#0F172A] transition-all flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-lg font-bold text-terminal-black font-body-md uppercase">{test.name}</h3>
                    <span className="bg-primary text-white text-[10px] font-label-mono px-2.5 py-1 border border-terminal-black pixel-corners-sm uppercase">
                      {test.categoryName || 'Mixed'}
                    </span>
                  </div>
                  <p className="text-xs text-ui-slate leading-relaxed font-body-md line-clamp-3">
                    {test.description || 'Practice test covering various aptitude sections.'}
                  </p>
                  <div className="flex items-center gap-4 text-xs font-label-mono text-terminal-black pt-2 uppercase font-bold">
                    <span>⏱️ {test.duration} Mins</span>
                  </div>
                </div>

                <button
                  onClick={() => handleStartTest(test.id)}
                  className="w-full bg-primary hover:bg-terminal-black text-white font-label-mono text-xs uppercase py-3 border-2 border-terminal-black pixel-corners shadow-[2px_2px_0px_#0F172A] active:translate-y-0.5 active:shadow-[1px_1px_0px_#0F172A] transition-all"
                >
                  Start Test
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Test Attempt History */}
      <div className="bg-white p-6 md:p-8 border-2 border-terminal-black pixel-corners shadow-[4px_4px_0px_#0F172A] space-y-6">
        <h2 className="text-xl font-display-pixel uppercase text-terminal-black">Your Test Attempts History</h2>
        {history.length === 0 ? (
          <div className="text-center py-8 text-ui-slate font-label-mono text-sm uppercase">
            You haven't attempted any tests yet. Your score history will be logged here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-terminal-black text-terminal-black font-label-mono text-xs uppercase font-bold">
                  <th className="pb-3 pr-4">Test Name</th>
                  <th className="pb-3 px-4">Score</th>
                  <th className="pb-3 px-4">Percentage</th>
                  <th className="pb-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((attempt) => (
                  <tr key={attempt.id} className="text-terminal-black hover:bg-surface-container font-body-md transition-colors">
                    <td className="py-4 pr-4 font-bold">{attempt.testName}</td>
                    <td className="py-4 px-4 font-label-mono">{attempt.score} / {attempt.totalQuestions}</td>
                    <td className="py-4 px-4 font-label-mono font-bold text-primary">
                      {Math.round((attempt.score / attempt.totalQuestions) * 100)}%
                    </td>
                    <td className="py-4 px-4 text-ui-slate text-xs font-label-mono uppercase">
                      {new Date(attempt.submittedAt).toLocaleDateString(undefined, {
                        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default TestCenterPage;
