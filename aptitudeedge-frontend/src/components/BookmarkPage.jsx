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
      <div className="bg-white p-8 border-2 border-terminal-black pixel-corners shadow-[4px_4px_0px_#0F172A] text-center max-w-md mx-auto space-y-4">
        <h1 className="text-2xl font-display-pixel uppercase text-terminal-black">Bookmarks</h1>
        <p className="text-ui-slate text-sm font-body-md">{error}</p>
        <button
          onClick={() => navigate('/auth')}
          className="bg-primary hover:bg-terminal-black text-white px-6 py-3 font-label-mono text-xs uppercase border-2 border-terminal-black pixel-corners shadow-[2px_2px_0px_#0F172A] transition-all"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-terminal-black font-label-mono text-sm uppercase tracking-widest animate-pulse">Loading bookmarks...</div>
      </div>
    );
  }

  const bookmarkedQuestions = questions.filter((q) => bookmarks.includes(q.id));

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Panel */}
      <div className="bg-white p-6 md:p-8 border-2 border-terminal-black pixel-corners shadow-[4px_4px_0px_#0F172A] space-y-2">
        <h1 className="text-2xl font-display-pixel uppercase text-terminal-black">Your Bookmarked Questions</h1>
        <p className="text-xs font-label-mono text-ui-slate uppercase">Review saved questions and solutions for practice revision.</p>
      </div>

      {/* Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {bookmarkedQuestions.length === 0 ? (
          <div className="col-span-full bg-white p-12 border-2 border-terminal-black text-center text-ui-slate font-label-mono uppercase pixel-corners space-y-4">
            <p className="font-body-md text-terminal-black">You haven't bookmarked any questions yet.</p>
            <button
              onClick={() => navigate('/practice')}
              className="bg-primary hover:bg-terminal-black text-white px-6 py-3 font-label-mono text-xs uppercase border-2 border-terminal-black pixel-corners shadow-[2px_2px_0px_#0F172A] transition-all"
            >
              Browse Questions
            </button>
          </div>
        ) : (
          bookmarkedQuestions.map((q) => (
            <div key={q.id} className="bg-white p-6 md:p-8 border-2 border-terminal-black pixel-corners shadow-[3px_3px_0px_#0F172A] space-y-5 hover:shadow-[4px_4px_0px_#0F172A] transition-all">
              <div className="flex justify-between items-center">
                <span className="bg-primary text-white text-[10px] font-label-mono px-2.5 py-1 border border-terminal-black pixel-corners-sm uppercase">
                  {q.category}
                </span>
                <button
                  onClick={() => handleRemoveBookmark(q.id)}
                  className="text-xs font-label-mono bg-red-600 text-white hover:bg-red-700 px-3 py-1.5 border border-terminal-black pixel-corners shadow-[1px_1px_0px_#0F172A] transition-all"
                >
                  Unbookmark
                </button>
              </div>

              <h3 className="text-base md:text-lg font-bold text-terminal-black font-body-md leading-relaxed">{q.text}</h3>

              <ul className="grid gap-3 text-sm">
                <li className="bg-surface-container px-4 py-3 border-2 border-terminal-black pixel-corners-sm text-terminal-black"><span className="font-label-mono font-bold mr-2 text-ui-slate">A:</span> {q.optionA}</li>
                <li className="bg-surface-container px-4 py-3 border-2 border-terminal-black pixel-corners-sm text-terminal-black"><span className="font-label-mono font-bold mr-2 text-ui-slate">B:</span> {q.optionB}</li>
                <li className="bg-surface-container px-4 py-3 border-2 border-terminal-black pixel-corners-sm text-terminal-black"><span className="font-label-mono font-bold mr-2 text-ui-slate">C:</span> {q.optionC}</li>
                <li className="bg-surface-container px-4 py-3 border-2 border-terminal-black pixel-corners-sm text-terminal-black"><span className="font-label-mono font-bold mr-2 text-ui-slate">D:</span> {q.optionD}</li>
              </ul>

              <div className="pt-4 border-t-2 border-terminal-black flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <div className="text-xs font-label-mono font-bold text-success-green uppercase">Correct Option: {q.correctAnswer}</div>
                  {q.explanation && (
                    <button
                      onClick={() => toggleExplanation(q.id)}
                      className="bg-terminal-black hover:bg-primary text-white px-4 py-1.5 font-label-mono text-[10px] uppercase pixel-corners shadow-[1.5px_1.5px_0px_#0F172A] transition-colors"
                    >
                      {expandedExplanations[q.id] ? 'Hide Solution' : 'Show Solution'}
                    </button>
                  )}
                </div>

                {expandedExplanations[q.id] && q.explanation && (
                  <div className="bg-surface-container border-2 border-terminal-black p-5 text-xs text-terminal-black leading-relaxed pixel-corners whitespace-pre-line">
                    <div className="font-label-mono font-bold text-terminal-black uppercase mb-1">Solution:</div>
                    <p className="font-body-md">{q.explanation}</p>
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
