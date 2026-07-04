import { useLocation, useNavigate } from 'react-router-dom';

function TestResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};
  const { result, testName, questions, userAnswers, isAuto } = state;

  if (!result) {
    return (
      <div className="bg-white p-8 border-2 border-terminal-black pixel-corners shadow-[4px_4px_0px_#0F172A] text-center space-y-4 max-w-md mx-auto">
        <h2 className="text-xl font-display-pixel uppercase text-terminal-black">No Test Data Found</h2>
        <p className="text-xs font-label-mono text-ui-slate uppercase">Please go back to the Test Center to take exams.</p>
        <button
          onClick={() => navigate('/tests')}
          className="bg-primary hover:bg-terminal-black text-white px-6 py-3 font-label-mono text-xs uppercase border-2 border-terminal-black pixel-corners shadow-[2px_2px_0px_#0F172A] transition-all"
        >
          Go to Test Center
        </button>
      </div>
    );
  }

  const scorePct = Math.round((result.correctAnswers / result.totalQuestions) * 100);

  let greeting = 'Good Attempt!';
  let colorStyle = 'bg-primary text-white';
  if (scorePct >= 80) {
    greeting = 'Outstanding! 🏆';
    colorStyle = 'bg-success-green text-white';
  } else if (scorePct >= 50) {
    greeting = 'Well Done! 👍';
    colorStyle = 'bg-blue-600 text-white';
  } else {
    greeting = 'Keep Practicing! 💪';
    colorStyle = 'bg-amber-400 text-terminal-black';
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Result Card */}
      <div className="bg-white p-8 border-2 border-terminal-black pixel-corners shadow-[4px_4px_0px_#0F172A] flex flex-col md:flex-row items-center gap-8 justify-between">
        <div className="space-y-3 text-center md:text-left">
          <span className="text-[10px] font-label-mono font-bold text-ui-slate uppercase tracking-widest">Test Completed</span>
          <h1 className="text-2xl font-display-pixel uppercase text-terminal-black leading-tight">{testName}</h1>
          <p className="text-xs font-label-mono text-ui-slate uppercase max-w-lg leading-relaxed">
            {isAuto ? 'The test timer ran out, and your test was automatically submitted.' : 'Your answers have been graded. Review your score and step-by-step solutions below.'}
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate('/tests')}
              className="bg-primary hover:bg-terminal-black text-white px-5 py-3 font-label-mono text-xs uppercase border-2 border-terminal-black pixel-corners shadow-[2px_2px_0px_#0F172A] transition-all"
            >
              Back to Test Center
            </button>
          </div>
        </div>

        <div className={`p-6 border-2 border-terminal-black pixel-corners shadow-[3px_3px_0px_#000] flex flex-col items-center justify-center min-w-[200px] text-center ${colorStyle}`}>
          <div className="text-4xl font-display-pixel">{scorePct}%</div>
          <div className="text-[10px] font-label-mono font-bold uppercase tracking-wider mt-1">{greeting}</div>
          <div className="text-xs mt-3 font-label-mono uppercase font-bold opacity-95">
            Score: {result.correctAnswers} / {result.totalQuestions}
          </div>
        </div>
      </div>

      {/* Review details */}
      <div className="space-y-6">
        <h2 className="text-xl font-display-pixel uppercase text-terminal-black">Question-by-Question Review</h2>
        
        {questions.map((q, idx) => {
          const userAns = userAnswers[q.id];
          const isCorrect = userAns && q.correctAnswer.trim().toLowerCase() === userAns.trim().toLowerCase();
          
          return (
            <div key={q.id} className="bg-white p-6 md:p-8 border-2 border-terminal-black pixel-corners shadow-[4px_4px_0px_#0F172A] space-y-6">
              <div className="flex items-center justify-between">
                <span className="bg-primary-container/10 border border-terminal-black text-primary text-[10px] font-label-mono px-3 py-1 pixel-corners-sm uppercase font-bold">
                  Question {idx + 1}
                </span>
                
                <span className={`text-[10px] font-label-mono font-bold px-3 py-1 border-2 border-terminal-black pixel-corners-sm uppercase shadow-[1px_1px_0px_#000] ${
                  isCorrect
                    ? 'bg-success-green text-white'
                    : 'bg-error text-white'
                }`}>
                  {isCorrect ? '✓ Correct' : '✗ Incorrect / Unanswered'}
                </span>
              </div>

              <h3 className="text-base md:text-lg font-bold text-terminal-black font-body-md leading-relaxed">
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
                  
                  let style = 'border-terminal-black bg-white text-terminal-black shadow-[1.5px_1.5px_0px_#0F172A]';
                  if (isCorrectAnswer) {
                    style = 'border-success-green bg-emerald-50 text-emerald-950 font-bold shadow-[1.5px_1.5px_0px_#059669]';
                  } else if (isUserSelected) {
                    style = 'border-error bg-red-50 text-red-950 font-bold shadow-[1.5px_1.5px_0px_#ba1a1a]';
                  }

                  return (
                    <div
                      key={opt.key}
                      className={`flex items-start border-2 px-4 py-3 font-body-md pixel-corners-sm ${style}`}
                    >
                      <span className="font-label-mono font-bold mr-2 text-ui-slate">{opt.key}.</span>
                      <span className="font-bold">{opt.val}</span>
                      {isUserSelected && <span className="ml-auto text-[9px] font-label-mono font-bold text-ui-slate uppercase tracking-wider">(Your Pick)</span>}
                    </div>
                  );
                })}
              </div>

              {q.explanation && (
                <div className="bg-surface-container border-2 border-terminal-black p-5 text-xs text-terminal-black leading-relaxed pixel-corners whitespace-pre-line">
                  <div className="font-label-mono font-bold text-terminal-black uppercase mb-1">Solution / Explanation:</div>
                  <p className="font-body-md">{q.explanation}</p>
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
