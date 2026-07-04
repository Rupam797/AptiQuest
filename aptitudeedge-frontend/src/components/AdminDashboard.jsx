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
      <div className="bg-white p-6 md:p-8 border-2 border-terminal-black pixel-corners shadow-[4px_4px_0px_#0F172A] space-y-2">
        <h1 className="text-2xl font-display-pixel uppercase text-terminal-black">Admin Control Panel</h1>
        <p className="text-xs font-label-mono text-ui-slate uppercase">Manage aptitude questions database and assemble custom practice exams.</p>
        
        {/* Tabs */}
        <div className="flex gap-3 pt-4 border-t-2 border-terminal-black mt-4">
          <button
            onClick={() => setActiveTab('question')}
            className={`px-5 py-2.5 border-2 border-terminal-black font-label-mono text-xs uppercase pixel-corners shadow-[2px_2px_0px_#0F172A] active:translate-y-0.5 active:shadow-[1px_1px_0px_#0F172A] transition-all ${
              activeTab === 'question' ? 'bg-primary text-white' : 'bg-white text-terminal-black hover:bg-surface-container'
            }`}
          >
            Add New Question
          </button>
          <button
            onClick={() => setActiveTab('test')}
            className={`px-5 py-2.5 border-2 border-terminal-black font-label-mono text-xs uppercase pixel-corners shadow-[2px_2px_0px_#0F172A] active:translate-y-0.5 active:shadow-[1px_1px_0px_#0F172A] transition-all ${
              activeTab === 'test' ? 'bg-primary text-white' : 'bg-white text-terminal-black hover:bg-surface-container'
            }`}
          >
            Assemble Custom Test
          </button>
        </div>
      </div>

      {message && <div className="p-4 border-2 border-terminal-black pixel-corners bg-emerald-50 text-emerald-950 text-xs font-label-mono uppercase font-bold">{message}</div>}
      {error && <div className="p-4 border-2 border-terminal-black pixel-corners bg-red-50 text-red-950 text-xs font-label-mono uppercase font-bold">{error}</div>}

      {activeTab === 'question' ? (
        /* Create Question Form */
        <div className="bg-white p-6 md:p-8 border-2 border-terminal-black pixel-corners shadow-[4px_4px_0px_#0F172A] space-y-6">
          <h2 className="text-lg font-display-pixel uppercase text-terminal-black">Add Aptitude Question</h2>
          
          <form onSubmit={handleCreateQuestion} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-label-mono font-bold text-terminal-black uppercase mb-2">Question Text</label>
                <textarea
                  required
                  rows={3}
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="w-full bg-surface-container border-2 border-terminal-black px-4 py-3 text-xs font-label-mono uppercase tracking-wider text-terminal-black focus:bg-white focus:outline-none focus:ring-0 pixel-corners"
                  placeholder="Enter the question details..."
                />
              </div>

              <div>
                <label className="block text-xs font-label-mono font-bold text-terminal-black uppercase mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-surface-container border-2 border-terminal-black px-4 py-3 text-xs font-label-mono uppercase tracking-wider text-terminal-black focus:bg-white focus:outline-none focus:ring-0 pixel-corners"
                >
                  <option value="Quantitative">Quantitative</option>
                  <option value="Logical Reasoning">Logical Reasoning</option>
                  <option value="Verbal">Verbal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-label-mono font-bold text-terminal-black uppercase mb-2">Correct Answer (Option)</label>
                <select
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  className="w-full bg-surface-container border-2 border-terminal-black px-4 py-3 text-xs font-label-mono uppercase tracking-wider text-terminal-black focus:bg-white focus:outline-none focus:ring-0 pixel-corners"
                >
                  <option value="A">Option A</option>
                  <option value="B">Option B</option>
                  <option value="C">Option C</option>
                  <option value="D">Option D</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-label-mono font-bold text-terminal-black uppercase mb-2">Option A</label>
                <input
                  type="text"
                  required
                  value={optionA}
                  onChange={(e) => setOptionA(e.target.value)}
                  className="w-full bg-surface-container border-2 border-terminal-black px-4 py-3 text-xs font-label-mono uppercase tracking-wider text-terminal-black focus:bg-white focus:outline-none focus:ring-0 pixel-corners"
                />
              </div>

              <div>
                <label className="block text-xs font-label-mono font-bold text-terminal-black uppercase mb-2">Option B</label>
                <input
                  type="text"
                  required
                  value={optionB}
                  onChange={(e) => setOptionB(e.target.value)}
                  className="w-full bg-surface-container border-2 border-terminal-black px-4 py-3 text-xs font-label-mono uppercase tracking-wider text-terminal-black focus:bg-white focus:outline-none focus:ring-0 pixel-corners"
                />
              </div>

              <div>
                <label className="block text-xs font-label-mono font-bold text-terminal-black uppercase mb-2">Option C</label>
                <input
                  type="text"
                  required
                  value={optionC}
                  onChange={(e) => setOptionC(e.target.value)}
                  className="w-full bg-surface-container border-2 border-terminal-black px-4 py-3 text-xs font-label-mono uppercase tracking-wider text-terminal-black focus:bg-white focus:outline-none focus:ring-0 pixel-corners"
                />
              </div>

              <div>
                <label className="block text-xs font-label-mono font-bold text-terminal-black uppercase mb-2">Option D</label>
                <input
                  type="text"
                  required
                  value={optionD}
                  onChange={(e) => setOptionD(e.target.value)}
                  className="w-full bg-surface-container border-2 border-terminal-black px-4 py-3 text-xs font-label-mono uppercase tracking-wider text-terminal-black focus:bg-white focus:outline-none focus:ring-0 pixel-corners"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-label-mono font-bold text-terminal-black uppercase mb-2">Step-by-Step Explanation</label>
                <textarea
                  rows={4}
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  className="w-full bg-surface-container border-2 border-terminal-black px-4 py-3 text-xs font-label-mono uppercase tracking-wider text-terminal-black focus:bg-white focus:outline-none focus:ring-0 pixel-corners"
                  placeholder="Provide detailed solutions/steps here..."
                />
              </div>
            </div>

            <div className="pt-2">
              <button className="bg-primary hover:bg-terminal-black text-white px-6 py-3 border-2 border-terminal-black font-label-mono text-xs uppercase pixel-corners shadow-[2px_2px_0px_#0F172A] active:translate-y-0.5 active:shadow-[1px_1px_0px_#0F172A] transition-all">
                Create Question
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Create Test Form */
        <div className="bg-white p-6 md:p-8 border-2 border-terminal-black pixel-corners shadow-[4px_4px_0px_#0F172A] space-y-6">
          <h2 className="text-lg font-display-pixel uppercase text-terminal-black">Assemble Exam/Quiz</h2>
          
          <form onSubmit={handleCreateTest} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-label-mono font-bold text-terminal-black uppercase mb-2">Test Name</label>
                <input
                  type="text"
                  required
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  className="w-full bg-surface-container border-2 border-terminal-black px-4 py-3 text-xs font-label-mono uppercase tracking-wider text-terminal-black focus:bg-white focus:outline-none focus:ring-0 pixel-corners"
                  placeholder="e.g., General Aptitude 2"
                />
              </div>

              <div>
                <label className="block text-xs font-label-mono font-bold text-terminal-black uppercase mb-2">Duration (Minutes)</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={testDuration}
                  onChange={(e) => setTestDuration(e.target.value)}
                  className="w-full bg-surface-container border-2 border-terminal-black px-4 py-3 text-xs font-label-mono uppercase tracking-wider text-terminal-black focus:bg-white focus:outline-none focus:ring-0 pixel-corners"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-label-mono font-bold text-terminal-black uppercase mb-2">Description</label>
                <textarea
                  rows={2}
                  value={testDesc}
                  onChange={(e) => setTestDesc(e.target.value)}
                  className="w-full bg-surface-container border-2 border-terminal-black px-4 py-3 text-xs font-label-mono uppercase tracking-wider text-terminal-black focus:bg-white focus:outline-none focus:ring-0 pixel-corners"
                  placeholder="Briefly describe what this test evaluates..."
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-label-mono font-bold text-terminal-black uppercase">Select Questions ({selectedQuestionIds.length} Selected)</label>
              
              <div className="max-h-60 overflow-y-auto border-2 border-terminal-black divide-y-2 divide-terminal-black bg-surface-container pixel-corners">
                {questions.map((q) => {
                  const isChecked = selectedQuestionIds.includes(q.id);
                  return (
                    <label key={q.id} className="flex items-start gap-3 p-3.5 hover:bg-white transition cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleQuestionSelection(q.id)}
                        className="mt-1 w-4 h-4 text-primary border-2 border-terminal-black focus:ring-0 cursor-pointer"
                      />
                      <div className="text-xs font-body-md text-terminal-black">
                        <span className="font-label-mono font-bold text-ui-slate mr-2 uppercase">[{q.category}]</span>
                        <span>{q.text}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <button className="bg-primary hover:bg-terminal-black text-white px-6 py-3 border-2 border-terminal-black font-label-mono text-xs uppercase pixel-corners shadow-[2px_2px_0px_#0F172A] active:translate-y-0.5 active:shadow-[1px_1px_0px_#0F172A] transition-all">
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
