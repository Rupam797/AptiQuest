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
    <div className="rounded-2xl bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold">Submit Test</h1>
      <form className="mt-6 space-y-6" onSubmit={submit}>
        <div>
          <label className="block text-sm font-medium text-slate-700">Test ID</label>
          <input
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2 focus:border-slate-900 focus:outline-none"
            value={testId}
            onChange={(e) => setTestId(e.target.value)}
          />
        </div>
        {[1, 2, 3].map((questionId) => (
          <div key={questionId} className="rounded-2xl border border-slate-200 p-4">
            <div className="font-medium">Question {questionId}</div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {['A', 'B', 'C', 'D'].map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`rounded-xl border px-4 py-2 text-sm ${answers[questionId] === option ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 bg-white text-slate-700'}`}
                  onClick={() => handleAnswer(questionId, option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
        <button className="rounded-2xl bg-slate-900 px-6 py-3 text-white">Submit answers</button>
      </form>
      {result && (
        <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-slate-800">
          {result.error ? (
            <div>{result.error}</div>
          ) : (
            <div>
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
