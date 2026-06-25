import { useEffect, useState } from 'react';
import api from '../api';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('question');
  const [questions, setQuestions] = useState([]);
  
  // Question Form State
  const [questionText, setQuestionText] = useState('');
  const [category, setCategory] = useState('Quantitative');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('A');
  const [explanation, setExplanation] = useState('');

  // Test Form State
  const [testName, setTestName] = useState('');
  const [testDesc, setTestDesc] = useState('');
  const [testDuration, setTestDuration] = useState(15);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadQuestions = () => {
    api.get('/questions')
      .then((res) => setQuestions(res.data || []))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    let correctText = optionA;
    if (correctAnswer === 'B') correctText = optionB;
    if (correctAnswer === 'C') correctText = optionC;
    if (correctAnswer === 'D') correctText = optionD;

    try {
      await api.post('/admin/questions', {
        text: questionText,
        category,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer: correctText,
        explanation,
      });

      setMessage('Question created successfully!');
      setQuestionText('');
      setOptionA('');
      setOptionB('');
      setOptionC('');
      setOptionD('');
      setExplanation('');
      loadQuestions();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create question');
    }
  };

  const handleCreateTest = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (selectedQuestionIds.length === 0) {
      setError('Please select at least one question for the test.');
      return;
    }

    try {
      await api.post('/admin/tests', {
        name: testName,
        description: testDesc,
        duration: Number(testDuration),
        questionIds: selectedQuestionIds,
      });

      setMessage('Aptitude Test created successfully!');
      setTestName('');
      setTestDesc('');
      setSelectedQuestionIds([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create test');
    }
  };

  const handleToggleQuestionSelection = (qId) => {
    setSelectedQuestionIds((prev) =>
      prev.includes(qId) ? prev.filter((id) => id !== qId) : [...prev, qId]
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">Admin Control Panel</h1>
        <p className="text-sm text-slate-500">Manage aptitude questions database and assemble custom practice exams.</p>
        
        {/* Tabs */}
        <div className="flex gap-2.5 pt-4 border-t border-slate-100 mt-4">
          <button
            onClick={() => setActiveTab('question')}
            className={`px-5 py-2 rounded-xl text-xs font-semibold border transition ${
              activeTab === 'question' ? 'bg-slate-950 border-slate-950 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Add New Question
          </button>
          <button
            onClick={() => setActiveTab('test')}
            className={`px-5 py-2 rounded-xl text-xs font-semibold border transition ${
              activeTab === 'test' ? 'bg-slate-950 border-slate-950 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Assemble Custom Test
          </button>
        </div>
      </div>

      {message && <div className="rounded-2xl bg-emerald-50 text-emerald-700 p-4 border border-emerald-100 text-sm font-semibold">{message}</div>}
      {error && <div className="rounded-2xl bg-red-50 text-red-700 p-4 border border-red-100 text-sm font-semibold">{error}</div>}

      {activeTab === 'question' ? (
        /* Create Question Form */
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-800">Add Aptitude Question</h2>
          
          <form onSubmit={handleCreateQuestion} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Question Text</label>
                <textarea
                  required
                  rows={3}
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition"
                  placeholder="Enter the question details..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
                >
                  <option value="Quantitative">Quantitative</option>
                  <option value="Logical Reasoning">Logical Reasoning</option>
                  <option value="Verbal">Verbal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Correct Answer (Option)</label>
                <select
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
                >
                  <option value="A">Option A</option>
                  <option value="B">Option B</option>
                  <option value="C">Option C</option>
                  <option value="D">Option D</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Option A</label>
                <input
                  type="text"
                  required
                  value={optionA}
                  onChange={(e) => setOptionA(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Option B</label>
                <input
                  type="text"
                  required
                  value={optionB}
                  onChange={(e) => setOptionB(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Option C</label>
                <input
                  type="text"
                  required
                  value={optionC}
                  onChange={(e) => setOptionC(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Option D</label>
                <input
                  type="text"
                  required
                  value={optionD}
                  onChange={(e) => setOptionD(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Step-by-Step Explanation</label>
                <textarea
                  rows={4}
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition"
                  placeholder="Provide detailed solutions/steps here..."
                />
              </div>
            </div>

            <div className="pt-2">
              <button className="bg-slate-900 hover:bg-slate-850 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition">
                Create Question
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Create Test Form */
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-800">Assemble Exam/Quiz</h2>
          
          <form onSubmit={handleCreateTest} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Test Name</label>
                <input
                  type="text"
                  required
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition"
                  placeholder="e.g., General Aptitude 2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Duration (Minutes)</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={testDuration}
                  onChange={(e) => setTestDuration(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  rows={2}
                  value={testDesc}
                  onChange={(e) => setTestDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition"
                  placeholder="Briefly describe what this test evaluates..."
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Select Questions ({selectedQuestionIds.length} Selected)</label>
              
              <div className="max-h-60 overflow-y-auto border border-slate-150 rounded-2xl divide-y divide-slate-100 bg-slate-50">
                {questions.map((q) => {
                  const isChecked = selectedQuestionIds.includes(q.id);
                  return (
                    <label key={q.id} className="flex items-start gap-3 p-3.5 hover:bg-white transition cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleQuestionSelection(q.id)}
                        className="mt-1 w-4 h-4 text-slate-900 border-slate-300 rounded focus:ring-slate-900"
                      />
                      <div className="text-xs">
                        <span className="font-semibold text-slate-500 mr-2 uppercase">[{q.category}]</span>
                        <span className="text-slate-800">{q.text}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <button className="bg-slate-900 hover:bg-slate-850 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition">
                Create Aptitude Test
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
