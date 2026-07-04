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
        <div className="text-terminal-black font-label-mono text-sm uppercase tracking-widest animate-pulse">Loading practice arena...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header and Category Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 border-2 border-terminal-black pixel-corners shadow-[4px_4px_0px_#0F172A]">
        <div className="space-y-1">
          <h1 className="text-2xl font-display-pixel uppercase text-terminal-black">Practice Arena</h1>
          <p className="text-xs font-label-mono text-ui-slate uppercase">Pick a category, choose your answers, and learn from detailed solutions.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <label className="text-xs font-label-mono font-bold text-terminal-black uppercase">Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-surface-container border-2 border-terminal-black rounded-none px-4 py-2 text-xs font-label-mono uppercase tracking-wider text-terminal-black focus:outline-none focus:bg-white pixel-corners-sm"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {message && (
        <div className="fixed bottom-6 right-6 z-50 bg-white text-terminal-black px-5 py-3 border-2 border-terminal-black pixel-corners shadow-[4px_4px_0px_#0F172A] text-xs font-label-mono uppercase">
          {message}
        </div>
      )}

      {/* Questions list */}
      <div className="space-y-8">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white p-10 border-2 border-terminal-black text-center text-ui-slate font-label-mono uppercase pixel-corners">
            No questions available for this category yet.
          </div>
        ) : (
          filteredQuestions.map((q, idx) => {
            const selectedOpt = selectedAnswers[q.id];
            const isAnswered = !!selectedOpt;
            const isBookmarked = bookmarkedIds.includes(q.id);
            const isCorrectAnswer = selectedOpt === q.correctAnswer;
            
            return (
              <div key={q.id} className="bg-white p-6 md:p-8 border-2 border-terminal-black pixel-corners shadow-[4px_4px_0px_#0F172A] space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="bg-primary-container/10 border border-terminal-black text-primary text-[10px] font-label-mono px-3 py-1 pixel-corners-sm uppercase font-bold">
                      Quest {idx + 1}
                    </span>
                    <span className="bg-primary text-white text-[10px] font-label-mono px-3 py-1 border border-terminal-black pixel-corners-sm uppercase">
                      {q.category}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handleBookmark(q.id)}
                    className={`w-9 h-9 border-2 border-terminal-black flex items-center justify-center pixel-corners shadow-[2px_2px_0px_#0F172A] transition-all ${
                      isBookmarked
                        ? 'bg-amber-400 text-terminal-black'
                        : 'bg-white text-ui-slate hover:bg-surface-container'
                    }`}
                    title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
                  >
                    <span className="material-symbols-outlined text-lg">star</span>
                  </button>
                </div>

                <h3 className="text-lg md:text-xl font-bold text-terminal-black font-body-md leading-relaxed">
                  {q.text}
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { label: 'A', text: q.optionA },
                    { label: 'B', text: q.optionB },
                    { label: 'C', text: q.optionC },
                    { label: 'D', text: q.optionD },
                  ].map((opt) => {
                    const isSelected = selectedOpt === opt.text;
                    const isThisCorrect = opt.text === q.correctAnswer;
                    
                    let btnStyle = 'border-terminal-black bg-white hover:bg-surface-container text-terminal-black hover:shadow-[3px_3px_0px_#0F172A] shadow-[2px_2px_0px_#0F172A]';
                    if (isAnswered) {
                      if (isThisCorrect) {
                        btnStyle = 'border-success-green bg-emerald-50 text-emerald-950 font-bold shadow-[2px_2px_0px_#059669]';
                      } else if (isSelected) {
                        btnStyle = 'border-error bg-red-50 text-red-950 font-bold shadow-[2px_2px_0px_#ba1a1a]';
                      } else {
                        btnStyle = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60 pointer-events-none shadow-none';
                      }
                    }

                    return (
                      <button
                        key={opt.label}
                        disabled={isAnswered}
                        onClick={() => handleSelectOption(q.id, opt.text)}
                        className={`flex items-start text-left border-2 px-5 py-4 text-sm font-body-md transition-all pixel-corners ${btnStyle}`}
                      >
                        <span className={`font-label-mono font-bold mr-3 ${isAnswered ? '' : 'text-slate-400'}`}>
                          {opt.label}.
                        </span>
                        <span className="font-bold">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <div className="pt-5 border-t-2 border-terminal-black space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      {isCorrectAnswer ? (
                        <span className="font-label-mono text-sm font-bold text-success-green uppercase flex items-center gap-1.5">
                          <span>✔ Correct Answer!</span>
                        </span>
                      ) : (
                        <span className="font-label-mono text-sm font-bold text-error uppercase flex items-center gap-1.5">
                          <span>✖ Incorrect Answer</span>
                        </span>
                      )}
                      
                      <button
                        onClick={() => toggleExplanation(q.id)}
                        className="bg-terminal-black hover:bg-primary text-white px-5 py-2 font-label-mono text-xs pixel-corners shadow-[2px_2px_0px_#0F172A] transition-colors"
                      >
                        {expandedExplanations[q.id] ? 'Hide Solution' : 'View Step-by-Step Solution'}
                      </button>
                    </div>

                    {expandedExplanations[q.id] && q.explanation && (
                      <div className="bg-surface-container border-2 border-terminal-black p-5 text-sm text-terminal-black leading-relaxed pixel-corners whitespace-pre-line">
                        <h4 className="font-display-pixel text-base text-terminal-black mb-2">Detailed Explanation:</h4>
                        <p className="font-body-md">{q.explanation}</p>
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
