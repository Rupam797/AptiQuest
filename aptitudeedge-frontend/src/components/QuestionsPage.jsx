import { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [expandedExplanations, setExpandedExplanations] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [questionsRes, bookmarksRes] = await Promise.all([
          api.get('/questions'),
          localStorage.getItem('token') ? api.get('/bookmarks') : Promise.resolve({ data: [] }),
        ]);

        setQuestions(questionsRes.data);
        setBookmarkedIds(bookmarksRes.data || []);

        const cats = ['All', ...new Set(questionsRes.data.map((q) => q.category).filter(Boolean))];
        setCategories(cats);
      } catch (error) {
        console.error('Error loading questions', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleBookmark = async (questionId) => {
    if (!localStorage.getItem('token')) {
      setMessage('Please login first to bookmark questions.');
      setTimeout(() => navigate('/auth'), 2000);
      return;
    }

    const isAlreadyBookmarked = bookmarkedIds.includes(questionId);

    try {
      if (isAlreadyBookmarked) {
        // Toggle/remove bookmark can be implemented by API. 
        // For standard UI, we call endpoint to toggle and update local state
        await api.post(`/bookmarks/${questionId}`);
        setBookmarkedIds((prev) => prev.filter((id) => id !== questionId));
        setMessage('Bookmark removed!');
      } else {
        await api.post(`/bookmarks/${questionId}`);
        setBookmarkedIds((prev) => [...prev, questionId]);
        setMessage('Added to Bookmarks!');
      }
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to toggle bookmark');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  const handleSelectOption = (questionId, optionValue) => {
    if (selectedAnswers[questionId]) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionValue }));
    setExpandedExplanations((prev) => ({ ...prev, [questionId]: true }));
  };

  const toggleExplanation = (questionId) => {
    setExpandedExplanations((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const filteredQuestions = selectedCategory === 'All'
    ? questions
    : questions.filter((q) => q.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-slate-600 font-semibold text-lg animate-pulse">Loading practice arena...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header and Category Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900">Practice Arena</h1>
          <p className="text-sm text-slate-500">Pick a category, choose your answers, and learn from detailed solutions.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {message && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-white text-slate-900 px-5 py-3 shadow-xl text-sm font-semibold border border-slate-200">
          {message}
        </div>
      )}

      {/* Questions list */}
      <div className="space-y-6">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 border border-slate-100 text-center text-slate-500">
            No questions available for this category yet.
          </div>
        ) : (
          filteredQuestions.map((q, idx) => {
            const selectedOpt = selectedAnswers[q.id];
            const isAnswered = !!selectedOpt;
            const isBookmarked = bookmarkedIds.includes(q.id);
            const isCorrectAnswer = selectedOpt === q.correctAnswer;
            
            return (
              <div key={q.id} className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6 hover:shadow-md transition duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="bg-slate-100 text-slate-700 text-xs font-extrabold px-3 py-1 rounded-full border border-slate-200">
                      Q. {idx + 1}
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full">
                      {q.category}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handleBookmark(q.id)}
                    className={`p-2 rounded-xl border transition ${
                      isBookmarked
                        ? 'bg-amber-50 border-amber-200 text-amber-500 hover:bg-amber-100'
                        : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                    }`}
                    title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                </div>

                <h3 className="text-lg md:text-xl font-bold text-slate-900 leading-snug">
                  {q.text}
                </h3>

                <div className="grid gap-3.5 sm:grid-cols-2">
                  {[
                    { label: 'A', text: q.optionA },
                    { label: 'B', text: q.optionB },
                    { label: 'C', text: q.optionC },
                    { label: 'D', text: q.optionD },
                  ].map((opt) => {
                    const isSelected = selectedOpt === opt.text;
                    const isThisCorrect = opt.text === q.correctAnswer;
                    
                    let btnStyle = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800';
                    if (isAnswered) {
                      if (isThisCorrect) {
                        btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold ring-1 ring-emerald-500';
                      } else if (isSelected) {
                        btnStyle = 'border-red-500 bg-red-50 text-red-800 font-semibold ring-1 ring-red-500';
                      } else {
                        btnStyle = 'border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed';
                      }
                    }

                    return (
                      <button
                        key={opt.label}
                        disabled={isAnswered}
                        onClick={() => handleSelectOption(q.id, opt.text)}
                        className={`flex items-start text-left rounded-2xl border px-5 py-4 text-sm transition duration-150 ${btnStyle}`}
                      >
                        <span className={`font-bold mr-3 ${isAnswered ? '' : 'text-slate-400'}`}>
                          {opt.label}.
                        </span>
                        <span>{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <div className="pt-4 border-t border-slate-100 space-y-4">
                    <div className="flex items-center gap-3">
                      {isCorrectAnswer ? (
                        <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
                          <span>✓ Correct Answer</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-sm font-semibold text-red-600">
                          <span>✗ Incorrect Answer</span>
                        </span>
                      )}
                      
                      <button
                        onClick={() => toggleExplanation(q.id)}
                        className="text-xs text-slate-500 hover:text-slate-900 underline font-semibold focus:outline-none"
                      >
                        {expandedExplanations[q.id] ? 'Hide Solution' : 'Show Solution'}
                      </button>
                    </div>

                    {expandedExplanations[q.id] && q.explanation && (
                      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/60 text-sm text-slate-800 leading-relaxed space-y-2">
                        <div className="font-bold text-slate-900 text-xs uppercase tracking-wider">Solution:</div>
                        <p>{q.explanation}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default QuestionsPage;
