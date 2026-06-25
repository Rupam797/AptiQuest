import { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function BookmarkPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [expandedExplanations, setExpandedExplanations] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadBookmarks = async () => {
    try {
      const [bookmarksRes, questionsRes] = await Promise.all([
        api.get('/bookmarks'),
        api.get('/questions'),
      ]);
      setBookmarks(bookmarksRes.data || []);
      setQuestions(questionsRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      setError('Please login to view your bookmarks.');
      setLoading(false);
      return;
    }
    loadBookmarks();
  }, []);

  const handleRemoveBookmark = async (questionId) => {
    try {
      await api.post(`/bookmarks/${questionId}`);
      setBookmarks((prev) => prev.filter((id) => id !== questionId));
    } catch (error) {
      console.error('Failed to remove bookmark', error);
    }
  };

  const toggleExplanation = (questionId) => {
    setExpandedExplanations((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  if (error) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-sm text-center max-w-md mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Bookmarks</h1>
        <p className="text-slate-500 text-sm">{error}</p>
        <button
          onClick={() => navigate('/auth')}
          className="bg-slate-900 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-slate-650 font-semibold text-lg animate-pulse">Loading bookmarks...</div>
      </div>
    );
  }

  const bookmarkedQuestions = questions.filter((q) => bookmarks.includes(q.id));

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Panel */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">Your Bookmarked Questions</h1>
        <p className="text-sm text-slate-500">Review saved questions and solutions for practice revision.</p>
      </div>

      {/* Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {bookmarkedQuestions.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl p-12 border border-slate-100 text-center text-slate-500 space-y-4">
            <p>You haven't bookmarked any questions yet.</p>
            <button
              onClick={() => navigate('/practice')}
              className="bg-slate-900 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition"
            >
              Browse Questions
            </button>
          </div>
        ) : (
          bookmarkedQuestions.map((q) => (
            <div key={q.id} className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-5 hover:shadow-md transition">
              <div className="flex justify-between items-center">
                <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-full border border-slate-200">
                  {q.category}
                </span>
                <button
                  onClick={() => handleRemoveBookmark(q.id)}
                  className="text-xs font-semibold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-xl transition border border-transparent hover:border-red-100"
                >
                  Unbookmark
                </button>
              </div>

              <h3 className="text-base md:text-lg font-bold text-slate-900 leading-snug">{q.text}</h3>

              <ul className="grid gap-2.5 text-sm">
                <li className="bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100"><span className="font-bold mr-2 text-slate-400">A:</span> {q.optionA}</li>
                <li className="bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100"><span className="font-bold mr-2 text-slate-400">B:</span> {q.optionB}</li>
                <li className="bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100"><span className="font-bold mr-2 text-slate-400">C:</span> {q.optionC}</li>
                <li className="bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100"><span className="font-bold mr-2 text-slate-400">D:</span> {q.optionD}</li>
              </ul>

              <div className="pt-3 border-t border-slate-100 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <div className="text-xs font-bold text-emerald-600">Correct Option: {q.correctAnswer}</div>
                  {q.explanation && (
                    <button
                      onClick={() => toggleExplanation(q.id)}
                      className="text-xs text-slate-500 hover:text-slate-900 underline font-semibold focus:outline-none"
                    >
                      {expandedExplanations[q.id] ? 'Hide Solution' : 'Show Solution'}
                    </button>
                  )}
                </div>

                {expandedExplanations[q.id] && q.explanation && (
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/50 text-xs leading-relaxed text-slate-800 space-y-1">
                    <div className="font-bold text-slate-900 text-[10px] uppercase tracking-wider">Solution:</div>
                    <p>{q.explanation}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default BookmarkPage;
