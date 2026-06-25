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
        <div className="text-slate-600 font-semibold text-lg animate-pulse">Loading Test Center...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">Test Center</h1>
        <p className="text-sm text-slate-500">Put your skills to the test under timed conditions to simulate real-world exams.</p>
      </div>

      {/* Available Tests Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Available Tests</h2>
        {tests.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 border border-slate-100 text-center text-slate-500">
            No tests have been configured by the admin yet.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tests.map((test) => (
              <div key={test.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-lg font-bold text-slate-800 leading-snug">{test.name}</h3>
                    <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-100">
                      {test.categoryName || 'Mixed'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {test.description || 'Practice test covering various aptitude sections.'}
                  </p>
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-600 pt-2">
                    <span className="flex items-center gap-1">
                      ⏱️ {test.duration} Mins
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleStartTest(test.id)}
                  className="w-full bg-slate-900 hover:bg-slate-850 text-white font-semibold py-2.5 rounded-xl text-sm transition duration-150 shadow"
                >
                  Start Test
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Test Attempt History */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-slate-900">Your Test Attempts History</h2>
        {history.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">
            You haven't attempted any tests yet. Your score history will be logged here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 font-semibold">
                  <th className="pb-3 pr-4">Test Name</th>
                  <th className="pb-3 px-4">Score</th>
                  <th className="pb-3 px-4">Percentage</th>
                  <th className="pb-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {history.map((attempt) => (
                  <tr key={attempt.id} className="text-slate-800 hover:bg-slate-50/50 transition">
                    <td className="py-4 pr-4 font-semibold">{attempt.testName}</td>
                    <td className="py-4 px-4">{attempt.score} / {attempt.totalQuestions}</td>
                    <td className="py-4 px-4 font-bold text-emerald-600">
                      {Math.round((attempt.score / attempt.totalQuestions) * 100)}%
                    </td>
                    <td className="py-4 px-4 text-slate-500 text-xs">
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
