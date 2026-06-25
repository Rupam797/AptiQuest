import { useState } from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  const isLoggedIn = !!localStorage.getItem('token');

  // Interactive Question State
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // FAQ State
  const [activeFaq, setActiveFaq] = useState(null);

  const demoQuestion = {
    text: "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
    options: {
      A: "120 metres",
      B: "180 metres",
      C: "324 metres",
      D: "150 metres"
    },
    correct: "D",
    explanation: "Speed = 60 km/hr = 60 * (5/18) m/sec = 50/3 m/sec.\nTime taken = 9 seconds.\nLength of the train (Distance) = Speed * Time = (50/3) * 9 = 150 metres."
  };

  const faqs = [
    {
      question: "Is AptiQuest free to use?",
      answer: "Yes, all practice modules, revision sheets, and test simulators are completely free for students preparing for campus placements, government competitive exams, and job interviews."
    },
    {
      question: "How does the Mock Test Center simulate actual exams?",
      answer: "Our Test Center offers timed environments with custom digital countdown timers, question status lists (showing unvisited, attempted, and marked for review), and auto-submits once the timer expires. You also get detailed history reports with explanation reviews."
    },
    {
      question: "Can I practice specific categories?",
      answer: "Yes! The Practice Arena allows filtering by Quantitative Aptitude, Logical Reasoning, and Verbal Ability, giving you the flexibility to focus on your weakest areas."
    },
    {
      question: "What is the Revision Hub?",
      answer: "The Revision Hub is a catalog of arithmetic formulas, logical shortcuts, and key cheat sheets. You can search, browse, and memorize critical shortcuts right before your test."
    }
  ];

  const handleOptionSelect = (key) => {
    setSelectedOption(key);
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="space-y-16 pb-16 max-w-5xl mx-auto">
      {/* Clean Hero Section (Light Theme) */}
      <section className="rounded-2xl bg-white text-slate-900 px-8 py-14 md:py-20 border border-slate-200 text-center space-y-6 shadow-sm">
        <div className="space-y-4 max-w-2xl mx-auto">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200 tracking-wide uppercase">
            Platform Release
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Build Your Aptitude Edge.
          </h1>
          <p className="text-base md:text-lg text-slate-600 leading-relaxed">
            A minimal, production-grade learning portal for quantitative prep, logical reasoning, and verbal tests. Practice with instant feedback and timed mock assessments.
          </p>
        </div>

        <div className="flex justify-center gap-3 pt-2">
          {isLoggedIn ? (
            <Link
              to="/dashboard"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition duration-150"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/auth"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition duration-150 shadow-sm"
              >
                Start Practicing Free
              </Link>
              <Link
                to="/auth"
                className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-lg border border-slate-200 transition duration-150"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Interactive Question Preview Widget */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Interactive Practice Demo</h2>
          <p className="text-sm text-slate-500">Test the practice arena interaction directly below.</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded border border-slate-200 uppercase">
              Quantitative
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Difficulty: Medium</span>
          </div>

          <p className="text-base font-semibold text-slate-850">
            {demoQuestion.text}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(demoQuestion.options).map(([key, val]) => {
              const isSelected = selectedOption === key;
              const isCorrect = key === demoQuestion.correct;
              
              let cardStyle = "border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:border-slate-300";
              if (selectedOption) {
                if (isSelected) {
                  cardStyle = isCorrect
                    ? "border-emerald-500 bg-emerald-50 text-emerald-950 font-medium"
                    : "border-red-500 bg-red-50 text-red-950 font-medium";
                } else if (isCorrect) {
                  cardStyle = "border-emerald-500 bg-emerald-50/50 text-emerald-900 font-medium";
                } else {
                  cardStyle = "border-slate-150 bg-slate-50 text-slate-400 opacity-60";
                }
              }

              return (
                <button
                  key={key}
                  onClick={() => !selectedOption && handleOptionSelect(key)}
                  disabled={!!selectedOption}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-left text-sm transition duration-150 ${cardStyle}`}
                >
                  <span className={`flex items-center justify-center w-7 h-7 rounded text-xs font-bold border transition ${
                    selectedOption && isSelected
                      ? isCorrect ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-red-600 text-white border-red-600'
                      : selectedOption && isCorrect
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 text-slate-500 border-slate-200'
                  }`}>
                    {key}
                  </span>
                  <span>{val}</span>
                </button>
              );
            })}
          </div>

          {selectedOption && (
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className={`text-xs font-bold flex items-center gap-1 ${
                  selectedOption === demoQuestion.correct ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {selectedOption === demoQuestion.correct ? (
                    <>✔ Correct Answer!</>
                  ) : (
                    <>✖ Incorrect. The correct option is D.</>
                  )}
                </span>
                <button
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="text-xs bg-slate-800 hover:bg-slate-900 text-white px-3.5 py-1.5 rounded font-medium transition"
                >
                  {showExplanation ? 'Hide Explanation' : 'View Step-by-Step Solution'}
                </button>
              </div>

              {showExplanation && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-150 text-xs text-slate-650 whitespace-pre-line leading-relaxed">
                  <h4 className="font-bold text-slate-800 mb-1.5">Detailed Explanation:</h4>
                  {demoQuestion.explanation}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Platform Core Modules</h2>
          <p className="text-sm text-slate-500">Everything needed to optimize your exam readiness.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="rounded-2xl bg-white p-6 border border-slate-200 hover:border-slate-350 transition duration-150 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="inline-block text-lg">🎯</span>
              <h3 className="text-base font-bold text-slate-800">Practice Arena</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Filter and practice questions across multiple categories. View instant option grading and step-by-step explanations.
              </p>
            </div>
            <Link to="/practice" className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold inline-flex items-center gap-1">
              Start Practice &rarr;
            </Link>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl bg-white p-6 border border-slate-200 hover:border-slate-350 transition duration-150 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="inline-block text-lg">⏱</span>
              <h3 className="text-base font-bold text-slate-800">Test Center</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Take timed practice exams simulating actual recruiter criteria. Dynamic countdown timers and status drawer panels included.
              </p>
            </div>
            <Link to="/tests" className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold inline-flex items-center gap-1">
              Take a Mock Test &rarr;
            </Link>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl bg-white p-6 border border-slate-200 hover:border-slate-350 transition duration-150 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="inline-block text-lg">📖</span>
              <h3 className="text-base font-bold text-slate-800">Revision Hub</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Browse mathematical formulas, coding tricks, and verbal rules to revise core concepts quickly prior to taking exams.
              </p>
            </div>
            <Link to="/revision" className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold inline-flex items-center gap-1">
              Review Formulas &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Clean Stats Banner */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-slate-100">
          <div>
            <div className="text-2xl font-bold text-slate-900">1,200+</div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-medium uppercase tracking-wide">Questions</div>
          </div>
          <div className="border-l border-slate-100">
            <div className="text-2xl font-bold text-slate-900">98%</div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-medium uppercase tracking-wide">Success Rate</div>
          </div>
          <div className="border-l border-slate-100">
            <div className="text-2xl font-bold text-slate-900">30+</div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-medium uppercase tracking-wide">Mock Tests</div>
          </div>
          <div className="border-l border-slate-100">
            <div className="text-2xl font-bold text-slate-900">10k+</div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-medium uppercase tracking-wide">Attempts</div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
          <p className="text-sm text-slate-500">Find answers to common questions about the platform.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div
                key={index}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all duration-150"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-4 text-left text-sm font-semibold text-slate-800 hover:bg-slate-50 transition"
                >
                  <span>{faq.question}</span>
                  <span className={`text-base text-slate-400 transition-transform duration-150 ${isOpen ? 'rotate-45 text-emerald-500' : ''}`}>
                    ＋
                  </span>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-500 leading-relaxed bg-slate-50/20">
                    <div className="pt-2 border-t border-slate-100">
                      {faq.answer}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Clean Bottom Call to Action */}
      <section className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center max-w-3xl mx-auto space-y-5">
        <h2 className="text-xl font-bold text-slate-900">Start Improving Your Scores Today</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          Create your free student account to track performance metrics, bookmark tricky questions, and view detailed exam score summaries.
        </p>
        <div className="pt-1">
          <Link
            to={isLoggedIn ? "/dashboard" : "/auth"}
            className="inline-flex px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition duration-150"
          >
            {isLoggedIn ? 'Go to Dashboard' : 'Get Started Now'}
          </Link>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
