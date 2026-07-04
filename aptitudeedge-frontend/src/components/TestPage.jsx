import { useState } from 'react';
import api from '../api';

function TestPage() {
  const [testId, setTestId] = useState('1');
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const handleAnswer = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post('/tests/submit', {
        testId: Number(testId),
        answers,
      });
      setResult(response.data);
    } catch (error) {
      setResult({ error: error.response?.data?.message || 'Submission failed' });
    }
  };

  return (
    <div className="bg-white p-8 border-2 border-terminal-black pixel-corners shadow-[4px_4px_0px_#0F172A] max-w-md mx-auto">
      <h1 className="text-2xl font-display-pixel uppercase text-terminal-black">Submit Test</h1>
      <form className="mt-6 space-y-6" onSubmit={submit}>
        <div>
          <label className="block text-xs font-label-mono font-bold text-terminal-black uppercase">Test ID</label>
          <input
            className="mt-1.5 w-full bg-surface-container border-2 border-terminal-black px-4 py-2.5 focus:bg-white focus:border-primary focus:ring-0 outline-none text-sm font-body-md pixel-corners"
            value={testId}
            onChange={(e) => setTestId(e.target.value)}
          />
        </div>
        {[1, 2, 3].map((questionId) => (
          <div key={questionId} className="border-2 border-terminal-black p-4 bg-white pixel-corners">
            <div className="font-label-mono font-bold text-xs uppercase text-terminal-black">Question {questionId}</div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {['A', 'B', 'C', 'D'].map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`border-2 border-terminal-black py-2 text-xs font-label-mono uppercase tracking-wider pixel-corners-sm transition-all shadow-[1.5px_1.5px_0px_#000] ${
                    answers[questionId] === option 
                      ? 'bg-primary text-white' 
                      : 'bg-white hover:bg-surface-container text-terminal-black'
                  }`}
                  onClick={() => handleAnswer(questionId, option)}
                >
                  Option {option}
                </button>
              ))}
            </div>
          </div>
        ))}
        <button className="w-full bg-primary hover:bg-terminal-black text-white px-6 py-3 border-2 border-terminal-black font-label-mono text-xs uppercase pixel-corners shadow-[2px_2px_0px_#0F172A] active:translate-y-0.5 active:shadow-[1px_1px_0px_#0F172A] transition-all">Submit answers</button>
      </form>
      {result && (
        <div className="mt-6 border-2 border-terminal-black bg-surface-container p-5 pixel-corners text-xs font-label-mono uppercase">
          {result.error ? (
            <div className="text-error">{result.error}</div>
          ) : (
            <div className="space-y-1 text-terminal-black">
              <p>Total questions: {result.totalQuestions}</p>
              <p>Correct answers: {result.correctAnswers}</p>
              <p>Score: {result.score}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TestPage;
