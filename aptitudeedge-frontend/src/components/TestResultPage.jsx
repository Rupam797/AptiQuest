import { useLocation, useNavigate } from 'react-router-dom';

function TestResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};
  const { result, testName, questions, userAnswers, isAuto } = state;

  if (!result) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center space-y-4 max-w-md mx-auto">
        <h2 className="text-xl font-bold text-slate-900">No Test Data Found</h2>
        <p className="text-sm text-slate-500">Please go back to the Test Center to take exams.</p>
        <button
          onClick={() => navigate('/tests')}
          className="bg-slate-900 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition"
        >
          Go to Test Center
        </button>
      </div>
    );
  }

  const scorePct = Math.round((result.correctAnswers / result.totalQuestions) * 100);

  let greeting = 'Good Attempt!';
  let colorStyle = 'text-blue-600 bg-blue-50 border-blue-100';
  if (scorePct >= 80) {
    greeting = 'Outstanding Performance! 🏆';
    colorStyle = 'text-emerald-700 bg-emerald-50 border-emerald-100';
  } else if (scorePct >= 50) {
    greeting = 'Well Done! 👍';
    colorStyle = 'text-indigo-700 bg-indigo-50 border-indigo-100';
  } else {
    greeting = 'Keep Practicing! 💪';
    colorStyle = 'text-amber-700 bg-amber-50 border-amber-100';
  }

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Result Card */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-8 justify-between">
        <div className="space-y-3 text-center md:text-left">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Test Completed</span>
          <h1 className="text-2xl font-black text-slate-900 leading-tight">{testName}</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            {isAuto ? 'The test timer ran out, and your test was automatically submitted.' : 'Your answers have been graded. Review your score and step-by-step solutions below.'}
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate('/tests')}
              className="bg-slate-900 hover:bg-slate-850 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow"
            >
              Back to Test Center
            </button>
          </div>
        </div>

        <div className={`p-6 rounded-3xl border flex flex-col items-center justify-center min-w-[200px] text-center ${colorStyle}`}>
          <div className="text-4xl font-extrabold">{scorePct}%</div>
          <div className="text-xs font-semibold uppercase tracking-wider mt-1">{greeting}</div>
          <div className="text-sm mt-3 font-semibold text-slate-700">
            Score: {result.correctAnswers} / {result.totalQuestions}
          </div>
        </div>
      </div>

      {/* Review details */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900">Question-by-Question Review</h2>
        
        {questions.map((q, idx) => {
          const userAns = userAnswers[q.id];
          const isCorrect = userAns && q.correctAnswer.trim().toLowerCase() === userAns.trim().toLowerCase();
          
          return (
            <div key={q.id} className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <span className="bg-slate-100 text-slate-700 text-xs font-extrabold px-3 py-1 rounded-full">
                  Question {idx + 1}
                </span>
                
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  isCorrect
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                    : 'bg-red-50 border-red-100 text-red-700'
                }`}>
                  {isCorrect ? '✓ Correct' : '✗ Incorrect / Unanswered'}
                </span>
              </div>

              <h3 className="text-base md:text-lg font-bold text-slate-900">
                {q.text}
              </h3>

              <div className="grid gap-3 sm:grid-cols-2 text-sm">
                {[
                  { key: 'A', val: q.optionA },
                  { key: 'B', val: q.optionB },
                  { key: 'C', val: q.optionC },
                  { key: 'D', val: q.optionD },
                ].map((opt) => {
                  const isUserSelected = userAns === opt.val;
                  const isCorrectAnswer = opt.val === q.correctAnswer;
                  
                  let style = 'border-slate-150 bg-white text-slate-800';
                  if (isCorrectAnswer) {
                    style = 'border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold ring-1 ring-emerald-500';
                  } else if (isUserSelected) {
                    style = 'border-red-500 bg-red-50 text-red-800 font-semibold ring-1 ring-red-500';
                  }

                  return (
                    <div
                      key={opt.key}
                      className={`flex items-start rounded-2xl border px-4 py-3 ${style}`}
                    >
                      <span className="font-bold mr-2 text-slate-400">{opt.key}.</span>
                      <span>{opt.val}</span>
                      {isUserSelected && <span className="ml-auto text-xs font-bold text-slate-500 uppercase tracking-widest">(Your Pick)</span>}
                    </div>
                  );
                })}
              </div>

              {q.explanation && (
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/50 text-sm leading-relaxed text-slate-800 space-y-2">
                  <div className="font-bold text-slate-900 text-xs uppercase tracking-wider">Solution / Explanation:</div>
                  <p>{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TestResultPage;
