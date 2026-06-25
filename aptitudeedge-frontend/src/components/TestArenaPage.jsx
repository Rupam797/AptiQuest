import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

function TestArenaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    api.get(`/tests/${id}`)
      .then((res) => {
        setTest(res.data);
        setTimeLeft(res.data.duration * 60);
      })
      .catch((err) => {
        console.error('Error fetching test details', err);
        navigate('/tests');
      })
      .finally(() => setLoading(false));

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [id]);

  useEffect(() => {
    if (loading || !test) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [loading, test]);

  const handleSelectOption = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const toggleMarkForReview = (questionId) => {
    setMarkedForReview((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const handleClearResponse = (questionId) => {
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[questionId];
      return copy;
    });
  };

  const handleAutoSubmit = () => {
    submitQuiz(true);
  };

  const submitQuiz = async (isAuto = false) => {
    if (timerRef.current) clearInterval(timerRef.current);
    try {
      const response = await api.post('/tests/submit', {
        testId: Number(id),
        answers,
      });

      navigate('/tests/result', {
        state: {
          result: response.data,
          testName: test.name,
          questions: test.questions,
          userAnswers: answers,
          isAuto,
        },
      });
    } catch (error) {
      console.error('Submission failed', error);
      alert('Error submitting test. Please try again.');
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-slate-600 font-semibold text-lg animate-pulse">Entering Arena...</div>
      </div>
    );
  }

  const currentQuestion = test.questions[currentIdx];
  const totalQuestions = test.questions.length;

  return (
    <div className="grid gap-8 lg:grid-cols-4 animate-fadeIn">
      {/* Question panel */}
      <div className="lg:col-span-3 bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm flex flex-col justify-between min-h-[500px]">
        <div>
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <span className="text-sm font-semibold text-slate-500">
              Question {currentIdx + 1} of {totalQuestions}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">⏱️</span>
              <span className={`text-base font-mono font-bold ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-slate-800'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          {/* Question Text */}
          <div className="py-6">
            <h3 className="text-lg md:text-xl font-bold text-slate-900 leading-snug">
              {currentQuestion.text}
            </h3>
          </div>

          {/* Options */}
          <div className="grid gap-3.5 sm:grid-cols-2">
            {[
              { label: 'A', text: currentQuestion.optionA },
              { label: 'B', text: currentQuestion.optionB },
              { label: 'C', text: currentQuestion.optionC },
              { label: 'D', text: currentQuestion.optionD },
            ].map((opt) => {
              const isSelected = answers[currentQuestion.id] === opt.text;
              return (
                <button
                  key={opt.label}
                  onClick={() => handleSelectOption(currentQuestion.id, opt.text)}
                  className={`flex items-start text-left rounded-2xl border px-5 py-4 text-sm transition duration-150 ${
                    isSelected
                      ? 'border-slate-900 bg-slate-900 text-white font-semibold shadow-md'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <span className={`font-bold mr-3 ${isSelected ? 'text-slate-200' : 'text-slate-400'}`}>
                    {opt.label}.
                  </span>
                  <span>{opt.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-wrap justify-between gap-4 mt-6">
          <div className="flex gap-2">
            <button
              onClick={() => toggleMarkForReview(currentQuestion.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition ${
                markedForReview[currentQuestion.id]
                  ? 'bg-amber-500 border-amber-500 text-white shadow'
                  : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
              }`}
            >
              {markedForReview[currentQuestion.id] ? '★ Marked' : '☆ Mark for Review'}
            </button>
            
            {answers[currentQuestion.id] && (
              <button
                onClick={() => handleClearResponse(currentQuestion.id)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-transparent text-red-500 hover:bg-red-50 transition"
              >
                Clear Response
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <button
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((prev) => prev - 1)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition"
            >
              Previous
            </button>
            
            {currentIdx < totalQuestions - 1 ? (
              <button
                onClick={() => setCurrentIdx((prev) => prev + 1)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition"
              >
                Next
              </button>
            ) : (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-600 shadow-md transition"
              >
                Submit Exam
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation panel */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Exam Questions</h3>
          
          <div className="grid grid-cols-4 gap-2.5">
            {test.questions.map((q, idx) => {
              const hasAnswered = !!answers[q.id];
              const isMarked = !!markedForReview[q.id];
              const isCurrent = currentIdx === idx;
              
              let style = 'border-slate-200 hover:bg-slate-50 text-slate-700';
              if (isMarked) {
                style = 'bg-amber-500 border-amber-500 text-white shadow-sm';
              } else if (hasAnswered) {
                style = 'bg-emerald-500 border-emerald-500 text-slate-950 shadow-sm font-semibold';
              }
              
              if (isCurrent) {
                style += ' ring-2 ring-slate-900 ring-offset-2';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(idx)}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl text-xs font-bold border transition duration-150 ${style}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md bg-emerald-500 border border-emerald-500 inline-block" />
            <span>Answered</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md bg-amber-500 border border-amber-500 inline-block" />
            <span>Marked for Review</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md bg-white border border-slate-200 inline-block" />
            <span>Not Visited</span>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full space-y-6 shadow-2xl border border-slate-100 animate-scaleUp">
            <div className="space-y-2 text-center">
              <h3 className="text-lg font-bold text-slate-900">Submit Exam?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                You have answered {Object.keys(answers).length} out of {totalQuestions} questions. Are you sure you want to finish and view your score?
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 border border-slate-200 hover:bg-slate-50 py-2.5 rounded-xl text-sm font-semibold text-slate-700 transition"
              >
                Go Back
              </button>
              <button
                onClick={() => submitQuiz(false)}
                className="flex-1 bg-slate-900 hover:bg-slate-800 py-2.5 rounded-xl text-sm font-semibold text-white transition shadow"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TestArenaPage;
