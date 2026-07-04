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
        <div className="text-terminal-black font-label-mono text-sm uppercase tracking-widest animate-pulse">Entering Arena...</div>
      </div>
    );
  }

  const currentQuestion = test.questions[currentIdx];
  const totalQuestions = test.questions.length;

  return (
    <div className="grid gap-8 lg:grid-cols-4 animate-fadeIn">
      {/* Question panel */}
      <div className="lg:col-span-3 bg-white p-6 md:p-8 border-2 border-terminal-black pixel-corners shadow-[4px_4px_0px_#0F172A] flex flex-col justify-between min-h-[500px]">
        <div>
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b-2 border-terminal-black">
            <span className="text-xs font-label-mono font-bold text-terminal-black uppercase">
              Quest {currentIdx + 1} of {totalQuestions}
            </span>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">schedule</span>
              <span className={`text-base font-label-mono font-bold px-3 py-1 border border-terminal-black pixel-corners-sm ${timeLeft < 60 ? 'bg-error text-white animate-pulse' : 'bg-surface-container text-terminal-black'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          {/* Question Text */}
          <div className="py-6">
            <h3 className="text-lg md:text-xl font-bold text-terminal-black font-body-md leading-relaxed">
              {currentQuestion.text}
            </h3>
          </div>

          {/* Options */}
          <div className="grid gap-4 sm:grid-cols-2">
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
                  className={`flex items-start text-left border-2 px-5 py-4 text-sm font-body-md transition-all pixel-corners ${
                    isSelected
                      ? 'border-terminal-black bg-primary text-white font-bold shadow-[2px_2px_0px_#000]'
                      : 'border-terminal-black bg-white hover:bg-surface-container text-terminal-black shadow-[2px_2px_0px_#0F172A]'
                  }`}
                >
                  <span className={`font-label-mono font-bold mr-3 ${isSelected ? 'text-white/70' : 'text-slate-400'}`}>
                    {opt.label}.
                  </span>
                  <span className="font-bold">{opt.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions bar */}
        <div className="pt-8 border-t-2 border-terminal-black flex flex-wrap justify-between gap-4 mt-6">
          <div className="flex gap-3">
            <button
              onClick={() => toggleMarkForReview(currentQuestion.id)}
              className={`px-4 py-2.5 border-2 border-terminal-black font-label-mono text-xs uppercase pixel-corners shadow-[2px_2px_0px_#0F172A] active:translate-y-0.5 active:shadow-[1px_1px_0px_#0F172A] transition-all ${
                markedForReview[currentQuestion.id]
                  ? 'bg-amber-400 text-terminal-black'
                  : 'bg-white text-terminal-black hover:bg-surface-container'
              }`}
            >
              {markedForReview[currentQuestion.id] ? '★ Marked' : '☆ Mark for Review'}
            </button>
            
            {answers[currentQuestion.id] && (
              <button
                onClick={() => handleClearResponse(currentQuestion.id)}
                className="px-4 py-2.5 border border-transparent text-red-650 hover:bg-red-50 font-label-mono text-xs uppercase pixel-corners-sm transition-all"
              >
                Clear Response
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <button
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((prev) => prev - 1)}
              className="px-4 py-2.5 border-2 border-terminal-black bg-white text-terminal-black hover:bg-surface-container font-label-mono text-xs uppercase pixel-corners shadow-[2px_2px_0px_#0F172A] active:translate-y-0.5 active:shadow-[1px_1px_0px_#0F172A] disabled:opacity-50 disabled:pointer-events-none transition-all"
            >
              Previous
            </button>
            
            {currentIdx < totalQuestions - 1 ? (
              <button
                onClick={() => setCurrentIdx((prev) => prev + 1)}
                className="px-5 py-2.5 border-2 border-terminal-black bg-primary text-white hover:bg-terminal-black font-label-mono text-xs uppercase pixel-corners shadow-[2px_2px_0px_#0f172a] active:translate-y-0.5 active:shadow-[1px_1px_0px_#0f172a] transition-all"
              >
                Next
              </button>
            ) : (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="px-6 py-2.5 border-2 border-terminal-black bg-success-green text-white hover:bg-emerald-700 font-label-mono text-xs uppercase pixel-corners shadow-[2px_2px_0px_#0f172a] active:translate-y-0.5 active:shadow-[1px_1px_0px_#0f172a] transition-all"
              >
                Submit Exam
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation panel */}
      <div className="bg-white p-6 border-2 border-terminal-black pixel-corners shadow-[4px_4px_0px_#0F172A] flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <h3 className="font-label-mono font-bold text-terminal-black text-xs uppercase tracking-wider">Exam Questions</h3>
          
          <div className="grid grid-cols-4 gap-2.5">
            {test.questions.map((q, idx) => {
              const hasAnswered = !!answers[q.id];
              const isMarked = !!markedForReview[q.id];
              const isCurrent = currentIdx === idx;
              
              let style = 'border-terminal-black hover:bg-surface-container text-terminal-black shadow-[1.5px_1.5px_0px_#0F172A]';
              if (isMarked) {
                style = 'bg-amber-400 border-terminal-black text-terminal-black shadow-[1.5px_1.5px_0px_#000]';
              } else if (hasAnswered) {
                style = 'bg-primary border-terminal-black text-white shadow-[1.5px_1.5px_0px_#000] font-bold';
              }
              
              if (isCurrent) {
                style += ' ring-2 ring-primary ring-offset-2';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(idx)}
                  className={`w-10 h-10 flex items-center justify-center pixel-corners-sm text-xs font-label-mono border-2 transition-all ${style}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2.5 pt-4 border-t-2 border-terminal-black text-[10px] font-label-mono text-ui-slate uppercase font-bold">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 pixel-corners-sm bg-primary border border-terminal-black inline-block" />
            <span>Answered</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 pixel-corners-sm bg-amber-400 border border-terminal-black inline-block" />
            <span>Marked for Review</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 pixel-corners-sm bg-white border border-terminal-black inline-block" />
            <span>Not Visited</span>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6">
          <div className="bg-white p-6 md:p-8 max-w-sm w-full space-y-6 border-2 border-terminal-black pixel-corners shadow-[8px_8px_0px_#0F172A] animate-scaleUp">
            <div className="space-y-2 text-center">
              <h3 className="text-lg font-display-pixel uppercase text-terminal-black">Submit Exam?</h3>
              <p className="text-xs font-body-md text-ui-slate leading-relaxed">
                You have answered {Object.keys(answers).length} out of {totalQuestions} questions. Are you sure you want to finish and view your score?
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 bg-white hover:bg-surface-container py-2.5 border-2 border-terminal-black pixel-corners text-xs font-label-mono uppercase text-terminal-black shadow-[2px_2px_0px_#0F172A] active:translate-y-0.5 active:shadow-[1px_1px_0px_#0F172A] transition-all"
              >
                Go Back
              </button>
              <button
                onClick={() => submitQuiz(false)}
                className="flex-1 bg-success-green hover:bg-emerald-700 py-2.5 border-2 border-terminal-black pixel-corners text-xs font-label-mono uppercase text-white shadow-[2px_2px_0px_#0F172A] active:translate-y-0.5 active:shadow-[1px_1px_0px_#0F172A] transition-all"
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
