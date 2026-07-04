import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import VoxelRobot from './VoxelRobot';

const WORLD_MAP_GRID = [
  "0000000000000011110000001111111111110000",
  "0000111110000111111000011111111111111000",
  "0011111111001111110000111111111111111100",
  "0111111111111111100000011111111111111000",
  "0111111111111111000000011111111111110000",
  "0011111111111100000000011111111111100000",
  "0001111111110000000000001111111111000000",
  "0000111111100000000000001111111111000000",
  "0000011111000000000000011111111111000000",
  "0000011110000000000000011111111100000000",
  "0000011100000000000000011111111000000000",
  "0000011100000000000000001111110000000000",
  "0000011000000000000000001111100000011000",
  "0000011000000000000000000111100000111100",
  "0000010000000000000000000011000001111100",
  "0000010000000000000000000001000000111000",
  "0000000000000000000000000000000000010000",
  "0000000000000000000000000000000000000000",
  "0111111111111111111111111111111111111110"
];

function LandingPage() {
  const isLoggedIn = !!localStorage.getItem('token');

  const pixelWave = useMemo(() => {
    const width = 1200;
    const stepSize = 8;
    const pointsCount = width / stepSize;
    let path = `M 0 80`;
    let h = 40;
    let trend = 0;
    const heights = [];
    for (let i = 0; i <= pointsCount; i++) {
      trend += (Math.random() - 0.5) * 3;
      trend = Math.max(-4, Math.min(4, trend));
      h += trend;
      h = Math.max(20, Math.min(60, h));
      const pixelHeight = Math.round(h / 4) * 4;
      heights.push(pixelHeight);
    }
    for (let i = 0; i <= pointsCount; i++) {
      const x = i * stepSize;
      const y = heights[i];
      path += ` H ${x} V ${y}`;
    }
    path += ` H ${width} V 80 H 0 Z`;

    const floatingPixels = [];
    for (let i = 2; i < pointsCount - 2; i += 3) {
      if (Math.random() < 0.35) {
        const x = i * stepSize + Math.floor(Math.random() * 4);
        const y = heights[i] - 8 - Math.floor(Math.random() * 12);
        floatingPixels.push({ x, y, size: Math.random() < 0.5 ? 4 : 6 });
      }
    }
    return { path, floatingPixels };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: "0px 0px -40px 0px"
    });

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach(el => observer.observe(el));

    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  }, []);

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
    <div className="bg-surface text-on-surface font-body-md overflow-x-hidden w-full">
      {/* Hero Section */}
      <header className="relative bg-primary-container min-h-[85vh] text-on-primary flex flex-col overflow-visible">
        <div className="absolute inset-0 bg-pixel-grid opacity-20 pointer-events-none"></div>

        {/* Top Nav Internal */}
        <nav className="relative z-50 flex justify-between items-start pt-10 px-margin-page w-full">
          <div className="flex items-start gap-3">
            <div className="w-4 h-4 bg-white mt-1 shrink-0"></div>
            <p className="font-label-mono text-[10px] md:text-xs text-on-primary uppercase tracking-widest leading-tight">
              Be Future-Ready, Build Real Skills.<br />Have Real Fun.
            </p>
          </div>
          <div className="flex items-center gap-8 md:gap-12">
            <div className="flex flex-col text-right font-label-mono text-xs uppercase gap-1">
              <a href="#programs" className="hover:opacity-70 text-white">programs</a>
              <a href="#about" className="hover:opacity-70 text-white">about</a>
              <a href="#join" className="hover:opacity-70 text-white">join</a>
            </div>
            <Link
              to={isLoggedIn ? "/dashboard" : "/auth"}
              className="border-2 border-on-primary px-5 py-3 font-label-mono text-xs pixel-corners bg-transparent text-white hover:bg-white hover:text-primary-container transition-all"
            >
              {isLoggedIn ? "Go to Dashboard" : "Book the first lesson"}
            </Link>
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex-grow flex flex-col justify-start items-center relative px-margin-page pt-24 pb-32 max-w-7xl mx-auto w-full z-10">
          <div className="relative w-full text-center">
            {/* Perfectly aligned watermark and foreground titles */}
            <div className="relative inline-block w-full">
              <h1 className="absolute inset-0 font-display-pixel text-[8.5vw] md:text-[7.8vw] leading-none text-white/[0.05] uppercase tracking-tighter select-none z-0 pointer-events-none">
                Build Your Aptitude Edge
              </h1>
              <h1 className="font-display-pixel text-[8.5vw] md:text-[7.8vw] leading-none uppercase tracking-tighter text-white select-none z-10 relative">
                Build Your Aptitude Edge
              </h1>
            </div>
          </div>
        </div>

        {/* 3D Voxel Robot - Centered in Header (behind subtitle, in front of text) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[45%] pointer-events-none z-20" style={{ width: '520px', height: '580px' }}>
          <VoxelRobot />
        </div>

        {/* Description Subtitle - Centered vertically on the right */}
        <div className="absolute right-margin-page top-1/2 -translate-y-1/2 max-w-[200px] text-left z-10 hidden md:block">
          <p className="text-xs font-label-mono leading-relaxed opacity-90 text-white">
            Sharpen fundamentals, spark curiosity, and get into top universities
          </p>
        </div>

        {/* SVG Pixel Drip Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px] text-surface fill-current">
            <path d="M0,120 H1200 V40 H1160 V60 H1120 V40 H960 V60 H920 V80 H880 V40 H720 V60 H680 V40 H560 V60 H520 V80 H480 V60 H440 V40 H320 V60 H280 V40 H160 V60 H120 V40 H0 Z" />
          </svg>
        </div>

        {/* Floating Blue Pixel Blocks */}
        <div className="absolute bg-primary-container w-4 h-4 left-[23%] bottom-[-8px] z-20 animate-bob-slow"></div>
        <div className="absolute bg-primary-container w-4 h-4 left-[23%] bottom-[-24px] z-20 animate-bob-fast"></div>
        <div className="absolute bg-primary-container w-4 h-4 left-[24.5%] bottom-[-16px] z-20 animate-bob-slow"></div>
        <div className="absolute bg-primary-container w-4 h-4 left-[26%] bottom-[-32px] z-20 animate-bob-fast"></div>
        <div className="absolute bg-primary-container w-4 h-4 left-[30%] bottom-[-20px] z-20 animate-bob-slow"></div>
        <div className="absolute bg-primary-container w-4 h-4 left-[72%] bottom-[-16px] z-20 animate-bob-fast"></div>
        <div className="absolute bg-primary-container w-4 h-4 left-[90%] bottom-[-16px] z-20 animate-bob-slow"></div>

        {/* Bottom Left Button (Apply now) */}
        <div className="absolute bottom-10 left-margin-page z-30">
          <Link
            to={isLoggedIn ? "/dashboard" : "/auth"}
            className="bg-primary text-white px-6 py-3 font-label-mono text-sm flex items-center justify-center gap-2 pixel-corners hover:bg-terminal-black transition-all shadow-[3px_3px_0px_#0F172A]"
          >
            Apply now <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        {/* Bottom Right Social Icons */}
        <div className="absolute bottom-10 right-margin-page z-30 flex gap-3">
          <a href="#" className="w-10 h-10 rounded-full border-2 border-terminal-black bg-white flex items-center justify-center text-terminal-black hover:bg-primary hover:text-white transition-all shadow-[2px_2px_0px_#0F172A]">
            <span className="material-symbols-outlined text-xl">play_circle</span>
          </a>
          <a href="#" className="w-10 h-10 rounded-full border-2 border-terminal-black bg-white flex items-center justify-center text-terminal-black hover:bg-primary hover:text-white transition-all shadow-[2px_2px_0px_#0F172A]">
            <span className="material-symbols-outlined text-xl">photo_camera</span>
          </a>
          <a href="#" className="w-10 h-10 rounded-full border-2 border-terminal-black bg-white flex items-center justify-center text-terminal-black hover:bg-primary hover:text-white transition-all shadow-[2px_2px_0px_#0F172A]">
            <span className="material-symbols-outlined text-xl">language</span>
          </a>
        </div>
      </header>

      {/* Programs Section */}
      <section className="py-block-gap max-w-7xl mx-auto px-margin-page reveal-on-scroll" id="programs">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <h2 className="font-display-pixel text-headline-lg uppercase mb-2 text-terminal-black">Programs</h2>
            <div className="flex items-center gap-2 text-ui-slate">
              <span className="w-3 h-3 bg-primary block"></span>
              <span className="font-label-mono text-sm">(JUN—AUG 2026)</span>
              <span className="font-label-mono text-sm opacity-60">Find the path that fits you</span>
            </div>
          </div>
          <Link
            to={isLoggedIn ? "/dashboard" : "/auth"}
            className="border-2 border-primary text-primary px-6 py-2 font-label-mono pixel-corners hover:bg-primary hover:text-white transition-colors flex items-center gap-2 uppercase text-sm font-semibold"
          >
            Apply now <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        <div className="border-y-2 border-terminal-black">
          {/* Program Row 1 */}
          <Link
            to={isLoggedIn ? "/practice" : "/auth"}
            className="group relative flex flex-col md:flex-row items-center py-8 px-6 border-b-2 border-terminal-black hover:bg-primary transition-all cursor-pointer text-left block text-terminal-black hover:text-white"
          >
            <div className="w-24 font-label-mono text-ui-slate group-hover:text-white/70 mb-2 md:mb-0">JUL 01</div>
            <div className="flex-grow">
              <h3 className="text-3xl font-display-pixel uppercase group-hover:text-white">Quantitative Aptitude</h3>
            </div>
            <div className="md:w-1/3 text-sm text-ui-slate group-hover:text-white/80 md:px-8 py-4 md:py-0 font-body-md">
              4 weeks fast-paced course designed to quickly build a strong foundation in essential logic and numbers.
            </div>
            <div className="flex items-center">
              <span className="material-symbols-outlined group-hover:text-white transition-transform group-hover:translate-x-2">arrow_forward_ios</span>
            </div>
          </Link>

          {/* Program Row 2 */}
          <Link
            to={isLoggedIn ? "/practice" : "/auth"}
            className="group relative flex flex-col md:flex-row items-center py-8 px-6 border-b-2 border-terminal-black hover:bg-primary transition-all cursor-pointer text-left block text-terminal-black hover:text-white"
          >
            <div className="w-24 font-label-mono text-ui-slate group-hover:text-white/70 mb-2 md:mb-0">JUL 15</div>
            <div className="flex-grow">
              <h3 className="text-3xl font-display-pixel uppercase group-hover:text-white">Logical Reasoning</h3>
            </div>
            <div className="md:w-1/3 text-sm text-ui-slate group-hover:text-white/80 md:px-8 py-4 md:py-0 font-body-md">
              Master the art of deduction, patterns, and algorithmic thinking through rigorous problem-solving sets.
            </div>
            <div className="flex items-center">
              <span className="material-symbols-outlined group-hover:text-white transition-transform group-hover:translate-x-2">arrow_forward_ios</span>
            </div>
          </Link>

          {/* Program Row 3 */}
          <Link
            to={isLoggedIn ? "/practice" : "/auth"}
            className="group relative flex flex-col md:flex-row items-center py-8 px-6 border-b-2 border-terminal-black hover:bg-primary transition-all cursor-pointer text-left block text-terminal-black hover:text-white"
          >
            <div className="w-24 font-label-mono text-ui-slate group-hover:text-white/70 mb-2 md:mb-0">AUG 01</div>
            <div className="flex-grow">
              <h3 className="text-3xl font-display-pixel uppercase group-hover:text-white">Verbal Ability</h3>
            </div>
            <div className="md:w-1/3 text-sm text-ui-slate group-hover:text-white/80 md:px-8 py-4 md:py-0 font-body-md">
              Advanced linguistics, comprehensive reading strategies, and vocabulary mastery for top-tier exams.
            </div>
            <div className="flex items-center">
              <span className="material-symbols-outlined group-hover:text-white transition-transform group-hover:translate-x-2">arrow_forward_ios</span>
            </div>
          </Link>

          {/* Program Row 4 */}
          <Link
            to={isLoggedIn ? "/practice" : "/auth"}
            className="group relative flex flex-col md:flex-row items-center py-8 px-6 hover:bg-primary transition-all cursor-pointer text-left block text-terminal-black hover:text-white"
          >
            <div className="w-24 font-label-mono text-ui-slate group-hover:text-white/70 mb-2 md:mb-0">AUG 15</div>
            <div className="flex-grow">
              <h3 className="text-3xl font-display-pixel uppercase group-hover:text-white">Data Interpretation</h3>
            </div>
            <div className="md:w-1/3 text-sm text-ui-slate group-hover:text-white/80 md:px-8 py-4 md:py-0 font-body-md">
              Learn to visualize, analyze, and extract meaningful insights from complex datasets and dynamic charts.
            </div>
            <div className="flex items-center">
              <span className="material-symbols-outlined group-hover:text-white transition-transform group-hover:translate-x-2">arrow_forward_ios</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Interactive Question Preview Widget */}
      <section className="py-block-gap max-w-5xl mx-auto px-margin-page space-y-6">
        <div className="text-center space-y-1">
          <h2 className="font-display-pixel text-headline-lg uppercase text-terminal-black">Interactive Practice Demo</h2>
          <p className="font-label-mono text-sm text-ui-slate">Test the practice arena interaction directly below.</p>
        </div>

        <div className="bg-surface-container-lowest border-2 border-terminal-black p-6 pixel-corners shadow-[6px_6px_0px_#0F172A] space-y-5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-primary-container text-white font-label-mono px-2 py-0.5 border border-terminal-black uppercase">
              Quantitative
            </span>
            <span className="text-xs text-ui-slate font-label-mono font-medium">Difficulty: Medium</span>
          </div>

          <p className="text-lg font-bold text-terminal-black leading-relaxed">
            {demoQuestion.text}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(demoQuestion.options).map(([key, val]) => {
              const isSelected = selectedOption === key;
              const isCorrect = key === demoQuestion.correct;

              let cardStyle = "border-terminal-black bg-surface hover:bg-surface-container text-terminal-black hover:shadow-[3px_3px_0px_#0F172A]";
              if (selectedOption) {
                if (isSelected) {
                  cardStyle = isCorrect
                    ? "border-success-green bg-emerald-50 text-emerald-950 font-bold shadow-[3px_3px_0px_#059669]"
                    : "border-error bg-red-50 text-red-950 font-bold shadow-[3px_3px_0px_#ba1a1a]";
                } else if (isCorrect) {
                  cardStyle = "border-success-green bg-emerald-50/50 text-emerald-900 font-bold";
                } else {
                  cardStyle = "border-slate-200 bg-slate-50 text-slate-400 opacity-60";
                }
              }

              return (
                <button
                  key={key}
                  onClick={() => !selectedOption && handleOptionSelect(key)}
                  disabled={!!selectedOption}
                  className={`flex items-center gap-4 p-4 border-2 font-body-md text-left transition duration-150 pixel-corners ${cardStyle}`}
                >
                  <span className={`flex items-center justify-center w-8 h-8 font-label-mono font-bold border-2 transition ${selectedOption && isSelected
                    ? isCorrect ? 'bg-success-green text-white border-success-green' : 'bg-error text-white border-error'
                    : selectedOption && isCorrect
                      ? 'bg-success-green text-white border-success-green'
                      : 'bg-surface-container text-terminal-black border-terminal-black'
                    }`}>
                    {key}
                  </span>
                  <span className="font-bold">{val}</span>
                </button>
              );
            })}
          </div>

          {selectedOption && (
            <div className="pt-5 border-t-2 border-terminal-black space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className={`font-label-mono text-sm font-bold flex items-center gap-1.5 ${selectedOption === demoQuestion.correct ? 'text-success-green' : 'text-error'
                  }`}>
                  {selectedOption === demoQuestion.correct ? (
                    <>✔ Correct Answer!</>
                  ) : (
                    <>✖ Incorrect. The correct option is D.</>
                  )}
                </span>
                <button
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="bg-terminal-black hover:bg-primary text-white px-5 py-2 font-label-mono text-xs pixel-corners transition-colors"
                >
                  {showExplanation ? 'Hide Explanation' : 'View Step-by-Step Solution'}
                </button>
              </div>

              {showExplanation && (
                <div className="bg-surface-container border-2 border-terminal-black p-5 font-body-md text-sm text-terminal-black whitespace-pre-line leading-relaxed pixel-corners">
                  <h4 className="font-display-pixel text-lg text-terminal-black mb-2">Detailed Explanation:</h4>
                  {demoQuestion.explanation}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Why Us Section */}
      <section className="bg-surface py-block-gap overflow-hidden relative reveal-on-scroll" id="about">
        {/* Decor pixels */}
        <div className="absolute top-1/4 -left-10 w-20 h-20 bg-primary/5 pixel-corners"></div>
        <div className="absolute bottom-1/4 -right-10 w-32 h-32 bg-primary/5 pixel-corners"></div>

        <div className="max-w-7xl mx-auto px-margin-page">
          <div className="text-center mb-24">
            <h2 className="font-display-pixel text-5xl md:text-6xl text-center uppercase tracking-tight text-terminal-black">WHY US?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {/* Card 1: Personal Mentorship */}
            <div className="relative w-full min-h-[380px] -rotate-[3.5deg] group hover:rotate-0 transition-all duration-200">
              {/* Stacked background cards */}
              <div className="absolute top-2.5 left-2.5 w-full h-full bg-terminal-black pixel-corners p-[2px] z-0">
                <div className="w-full h-full bg-primary-container pixel-corners"></div>
              </div>
              <div className="absolute top-5 left-5 w-full h-full bg-terminal-black pixel-corners p-[2px] z-[-1]">
                <div className="w-full h-full bg-primary-container pixel-corners"></div>
              </div>

              {/* Main foreground card wrapper */}
              <div className="relative bg-terminal-black pixel-corners p-[2px] z-10 w-full h-full">
                <div className="relative bg-primary-container text-white p-8 min-h-[376px] flex flex-col justify-end pixel-corners h-full">
                  {/* Pixel Knight Sprite */}
                  <div className="absolute top-6 right-6 text-white opacity-95">
                    <svg viewBox="0 0 16 20" className="w-14 h-18 fill-current">
                      <rect x="7" y="0" width="2" height="1" />
                      <rect x="6" y="1" width="4" height="1" />
                      <rect x="5" y="2" width="6" height="4" />
                      <rect x="7" y="4" width="2" height="1" fill="#2b59ff" />
                      <rect x="4" y="6" width="8" height="8" />
                      <rect x="2" y="7" width="2" height="2" />
                      <rect x="2" y="3" width="1" height="12" />
                      <rect x="1" y="6" width="3" height="1" />
                      <rect x="12" y="7" width="2" height="2" />
                      <rect x="5" y="14" width="2" height="2" />
                      <rect x="9" y="14" width="2" height="2" />
                    </svg>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-bold text-[24px] leading-tight tracking-tight text-white lowercase">personal mentorship</h4>
                    <p className="text-xs opacity-90 leading-relaxed font-body-md lowercase">
                      1-on-1 mentoring with practicing engineers and scientists
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Real-world Skills */}
            <div className="relative w-full min-h-[380px] rotate-[2.5deg] group hover:rotate-0 transition-all duration-200">
              {/* Stacked background cards */}
              <div className="absolute top-2.5 left-2.5 w-full h-full bg-terminal-black pixel-corners p-[2px] z-0">
                <div className="w-full h-full bg-primary-container pixel-corners"></div>
              </div>

              {/* Main foreground card wrapper */}
              <div className="relative bg-terminal-black pixel-corners p-[2px] z-10 w-full h-full">
                <div className="relative bg-primary-container text-white p-8 min-h-[376px] flex flex-col justify-end pixel-corners h-full">
                  {/* Cutout top-left */}
                  <div className="absolute -top-0.5 -left-0.5 w-6 h-6 bg-surface border-r-2 border-b-2 border-terminal-black z-20"></div>

                  {/* Pixel Sword/Key Sprite */}
                  <div className="absolute top-6 right-8 text-white opacity-95">
                    <svg viewBox="0 0 16 16" className="w-12 h-12 fill-current">
                      <rect x="12" y="2" width="2" height="2" />
                      <rect x="11" y="3" width="2" height="2" />
                      <rect x="9" y="5" width="2" height="2" />
                      <rect x="8" y="6" width="2" height="2" />
                      <rect x="6" y="8" width="2" height="2" />
                      <rect x="5" y="9" width="2" height="2" />
                      <rect x="3" y="10" width="3" height="2" />
                      <rect x="4" y="9" width="2" height="3" />
                      <rect x="2" y="12" width="2" height="2" />
                    </svg>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-bold text-[24px] leading-tight tracking-tight text-white lowercase">real-world skills</h4>
                    <p className="text-xs opacity-90 leading-relaxed font-body-md lowercase">
                      Hands-on projects that build actual skills employers want
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Proven Success */}
            <div className="relative w-full min-h-[380px] -rotate-[2deg] group hover:rotate-0 transition-all duration-200">
              {/* Stacked background cards (shifted to top-left) */}
              <div className="absolute -top-2.5 -left-2.5 w-full h-full bg-terminal-black pixel-corners p-[2px] z-0">
                <div className="w-full h-full bg-primary-container pixel-corners"></div>
              </div>
              <div className="absolute -top-5 -left-5 w-full h-full bg-terminal-black pixel-corners p-[2px] z-[-1]">
                <div className="w-full h-full bg-primary-container pixel-corners"></div>
              </div>

              {/* Main foreground card wrapper */}
              <div className="relative bg-terminal-black pixel-corners p-[2px] z-10 w-full h-full">
                <div className="relative bg-primary-container text-white p-8 min-h-[376px] flex flex-col justify-end pixel-corners h-full">
                  {/* Pixel Cute Robot Sprite */}
                  <div className="absolute top-6 right-6 text-white opacity-95">
                    <svg viewBox="0 0 16 18" className="w-14 h-16 fill-current">
                      <rect x="7" y="0" width="2" height="2" />
                      <rect x="8" y="2" width="1" height="2" />
                      <rect x="5" y="4" width="7" height="6" />
                      <rect x="6" y="6" width="2" height="2" fill="#2b59ff" />
                      <rect x="9" y="6" width="2" height="2" fill="#2b59ff" />
                      <rect x="7" y="10" width="3" height="1" />
                      <rect x="4" y="11" width="9" height="5" />
                      <rect x="2" y="12" width="2" height="2" />
                      <rect x="13" y="12" width="2" height="2" />
                      <rect x="5" y="16" width="2" height="2" />
                      <rect x="10" y="16" width="2" height="2" />
                    </svg>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-bold text-[24px] leading-tight tracking-tight text-white lowercase">proven success</h4>
                    <p className="text-xs opacity-90 leading-relaxed font-body-md lowercase">
                      Proven track record: 95% of graduates accepted to top universities
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Expert Curriculum */}
            <div className="relative w-full min-h-[380px] rotate-[3deg] group hover:rotate-0 transition-all duration-200">
              {/* Stacked background cards (shifted to top-left) */}
              <div className="absolute -top-2.5 -left-2.5 w-full h-full bg-terminal-black pixel-corners p-[2px] z-0">
                <div className="w-full h-full bg-primary-container pixel-corners"></div>
              </div>
              <div className="absolute -top-5 -left-5 w-full h-full bg-terminal-black pixel-corners p-[2px] z-[-1]">
                <div className="w-full h-full bg-primary-container pixel-corners"></div>
              </div>

              {/* Main foreground card wrapper */}
              <div className="relative bg-terminal-black pixel-corners p-[2px] z-10 w-full h-full">
                <div className="relative bg-primary-container text-white p-8 min-h-[376px] flex flex-col justify-end pixel-corners h-full">
                  {/* Cutout bottom-right */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-surface border-t-2 border-l-2 border-terminal-black z-20"></div>

                  {/* Pixel Warrior Sprite */}
                  <div className="absolute top-6 right-6 text-white opacity-95">
                    <svg viewBox="0 0 18 20" className="w-16 h-18 fill-current">
                      <rect x="4" y="1" width="2" height="2" />
                      <rect x="12" y="1" width="2" height="2" />
                      <rect x="5" y="3" width="8" height="4" />
                      <rect x="6" y="5" width="2" height="1" fill="#2b59ff" />
                      <rect x="10" y="5" width="2" height="1" fill="#2b59ff" />
                      <rect x="5" y="7" width="8" height="8" />
                      <rect x="1" y="8" width="3" height="5" />
                      <rect x="2" y="7" width="1" height="7" />
                      <rect x="14" y="5" width="1" height="8" />
                      <rect x="13" y="7" width="3" height="1" />
                      <rect x="6" y="15" width="2" height="2" />
                      <rect x="10" y="15" width="2" height="2" />
                    </svg>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-bold text-[24px] leading-tight tracking-tight text-white lowercase">expert curriculum</h4>
                    <p className="text-xs opacity-90 leading-relaxed font-body-md lowercase">
                      Structured learning maps curated by leading placement experts
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-3xl mx-auto py-block-gap px-margin-page space-y-6 reveal-on-scroll">
        <div className="text-center space-y-1">
          <h2 className="font-display-pixel text-headline-lg uppercase text-terminal-black">Frequently Asked Questions</h2>
          <p className="font-label-mono text-sm text-ui-slate">Find answers to common questions about the platform.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div
                key={index}
                className="bg-surface-container-lowest border-2 border-terminal-black overflow-hidden pixel-corners shadow-[3px_3px_0px_#0F172A] transition-all"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-5 text-left text-base font-bold text-terminal-black hover:bg-surface-container transition-colors"
                >
                  <span className="font-body-md font-bold">{faq.question}</span>
                  <span className={`text-xl font-label-mono font-bold text-primary transition-transform duration-150 ${isOpen ? 'rotate-45' : ''}`}>
                    ＋
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-ui-slate leading-relaxed bg-surface">
                    <div className="pt-3 border-t-2 border-terminal-black font-body-md">
                      {faq.answer}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-surface py-20 border-t-2 border-terminal-black reveal-on-scroll">
        <div className="text-center mb-16 max-w-4xl mx-auto px-4">
          <h2 className="font-display-pixel text-3xl md:text-[36px] leading-tight uppercase tracking-tight text-center text-terminal-black">
            <span className="mr-2" style={{ WebkitTextStroke: '1.5px #0F172A', color: 'transparent' }}>PARENTS LOVE</span> THE PROGRESS
            <br />
            <span className="mr-2" style={{ WebkitTextStroke: '1.5px #0F172A', color: 'transparent' }}>TEENS LOVE</span> THE VIBE
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-margin-page">
          {/* Testimonial 1 */}
          <div className="relative">
            <div className="bg-[#1e1e1e] text-white p-8 min-h-[220px] flex flex-col justify-center relative border-2 border-terminal-black pixel-corners">
              {/* Custom top-right white cutout */}
              <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-surface border-l-2 border-b-2 border-terminal-black z-20"></div>
              {/* Custom bottom-left white cutout */}
              <div className="absolute -bottom-0.5 -left-0.5 w-4 h-4 bg-surface border-t-2 border-r-2 border-terminal-black z-20"></div>

              <p className="text-xs md:text-sm font-body-md italic leading-relaxed opacity-95">
                "The only program my son didn't quit. Now he's ahead of class. We've tried so many extracurricular activities over the years, but nothing really stuck—until this."
              </p>
            </div>
            <div className="mt-4 text-right pr-4 font-body-md">
              <span className="font-bold text-xs text-terminal-black">Alex, parent of 15 y.o.</span>
              <span className="text-[10px] text-ui-slate block mt-0.5">USA, California</span>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="relative">
            <div className="bg-[#1e1e1e] text-white p-8 min-h-[220px] flex flex-col justify-center relative border-2 border-terminal-black pixel-corners">
              {/* Custom top-right white cutout */}
              <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-surface border-l-2 border-b-2 border-terminal-black z-20"></div>
              {/* Custom bottom-left white cutout */}
              <div className="absolute -bottom-0.5 -left-0.5 w-4 h-4 bg-surface border-t-2 border-r-2 border-terminal-black z-20"></div>

              <p className="text-xs md:text-sm font-body-md italic leading-relaxed opacity-95">
                "I used to think coding was boring, but this program changed everything. The lessons are fun and actually make sense. I got to build my own game, and now I'm thinking about studying computer science in college. It's not just about tech—it's about feeling like I can create something real."
              </p>
            </div>
            <div className="mt-4 text-right pr-4 font-body-md">
              <span className="font-bold text-xs text-terminal-black">Andrea, student, 17 y.o.</span>
              <span className="text-[10px] text-ui-slate block mt-0.5">USA, NYC</span>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="relative">
            <div className="bg-[#1e1e1e] text-white p-8 min-h-[220px] flex flex-col justify-center relative border-2 border-terminal-black pixel-corners">
              {/* Custom top-right white cutout */}
              <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-surface border-l-2 border-b-2 border-terminal-black z-20"></div>
              {/* Custom bottom-left white cutout */}
              <div className="absolute -bottom-0.5 -left-0.5 w-4 h-4 bg-surface border-t-2 border-r-2 border-terminal-black z-20"></div>

              <p className="text-xs md:text-sm font-body-md italic leading-relaxed opacity-95">
                "My daughter went from zero experience to building her own website in just a few weeks! What impressed me most was how the instructors explained things in a way she could truly understand. She looks forward to every session—and that says a lot coming from a teenager! This program has given her direction and self-belief"
              </p>
            </div>
            <div className="mt-4 text-right pr-4 font-body-md">
              <span className="font-bold text-xs text-terminal-black">Viki, parent of 16 y.o.</span>
              <span className="text-[10px] text-ui-slate block mt-0.5">USA, California</span>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stats / CTA Section */}
      <section className="relative bg-terminal-black text-on-primary py-block-gap reveal-on-scroll" id="join">
        <div className="absolute inset-0 bg-pixel-grid opacity-10 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-margin-page relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2 text-left">
            <h2 className="font-display-pixel text-4xl md:text-5xl uppercase mb-6 leading-tight text-white">Ready to level up your career trajectory?</h2>
            <p className="text-lg text-white/70 mb-8 font-body-md">
              Join a community of thousands of high-achievers. Applications for the Fall intake are now open.
            </p>
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <div className="font-display-pixel text-4xl text-primary-container">12k+</div>
                <div className="font-label-mono text-xs uppercase text-white/50">Graduates</div>
              </div>
              <div>
                <div className="font-display-pixel text-4xl text-primary-container">150+</div>
                <div className="font-label-mono text-xs uppercase text-white/50">Industry Partners</div>
              </div>
            </div>
          </div>
          <div className="lg:w-1/3 w-full text-left">
            <div className="bg-surface p-1 border-2 border-primary pixel-corners">
              <div className="bg-surface p-8 border-2 border-terminal-black text-terminal-black">
                <h3 className="font-display-pixel text-2xl text-terminal-black uppercase mb-6">Inquiry Form</h3>
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Success! Your quest begins soon.'); }}>
                  <div>
                    <label className="font-label-mono text-xs text-terminal-black uppercase block mb-1">Player Name</label>
                    <input className="w-full bg-surface-container border-2 border-terminal-black p-3 font-body-md focus:border-primary focus:ring-0 outline-none" placeholder="John Doe" type="text" required />
                  </div>
                  <div>
                    <label className="font-label-mono text-xs text-terminal-black uppercase block mb-1">Access Email</label>
                    <input className="w-full bg-surface-container border-2 border-terminal-black p-3 font-body-md focus:border-primary focus:ring-0 outline-none" placeholder="john@domain.com" type="email" required />
                  </div>
                  <div>
                    <label className="font-label-mono text-xs text-terminal-black uppercase block mb-1">Selected Program</label>
                    <select className="w-full bg-surface-container border-2 border-terminal-black p-3 font-body-md focus:border-primary focus:ring-0 outline-none">
                      <option>Quantitative Aptitude</option>
                      <option>Logical Reasoning</option>
                      <option>Verbal Ability</option>
                      <option>Data Interpretation</option>
                    </select>
                  </div>
                  <button className="w-full bg-primary text-on-primary py-4 font-label-mono uppercase tracking-widest hover:bg-terminal-black transition-colors active:scale-95 pixel-corners mt-4">
                    Join the Quest
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer 
        className="bg-primary-container text-on-primary relative overflow-hidden" 
        style={{ clipPath: 'polygon(0 15%, 2% 15%, 2% 5%, 4% 5%, 4% 15%, 6% 15%, 6% 0%, 8% 0%, 8% 15%, 12% 15%, 12% 5%, 14% 5%, 14% 15%, 100% 15%, 100% 100%, 0 100%)' }}
      >
        {/* Upper Footer: Links & Contacts */}
        <div className="max-w-7xl mx-auto pt-10 px-margin-page pb-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-6 pt-12">
            <div className="flex flex-col gap-2 text-left">
              <a href="#programs" className="font-label-mono text-sm hover:opacity-70 transition-opacity">programs</a>
              <a href="#about" className="font-label-mono text-sm hover:opacity-70 transition-opacity">about</a>
              <a href="#join" className="font-label-mono text-sm hover:opacity-70 transition-opacity">join</a>
            </div>

            <div className="text-center">
              <p className="font-display-pixel text-xl md:text-2xl">Real Learning. Real Skills. Real Fun</p>
            </div>

            <div className="flex flex-col gap-3 text-sm font-label-mono items-end">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">call</span>
                <span className="">+38 (067) 123-45-67</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">mail</span>
                <span className="">support@stemsch.com</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">schedule</span>
                <span className="">M-St: 10:00 - 19:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Procedural Pixelated Wave Transition Layer */}
        <div className="w-full bg-primary-container leading-none select-none pointer-events-none">
          <svg viewBox="0 0 1200 80" preserveAspectRatio="none" className="w-full h-[48px] text-primary fill-current relative block">
            <path d={pixelWave.path} />
            {pixelWave.floatingPixels.map((p, idx) => (
              <rect key={idx} x={p.x} y={p.y} width={p.size} height={p.size} />
            ))}
          </svg>
        </div>

        {/* Lower Footer: Copyright & Watermark */}
        <div className="bg-primary text-on-primary py-12 px-margin-page relative overflow-hidden">
          {/* Subtle Background Pixel World Map */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg viewBox="0 0 400 190" className="w-full max-w-4xl h-full" style={{ color: '#0F172A' }}>
              {WORLD_MAP_GRID.map((row, rIdx) => 
                row.split('').map((char, cIdx) => {
                  if (char === '1') {
                    return (
                      <rect 
                        key={`${rIdx}-${cIdx}`} 
                        x={cIdx * 10} 
                        y={rIdx * 10} 
                        width="8" 
                        height="8" 
                        fill="currentColor" 
                        opacity="0.18"
                      />
                    );
                  }
                  return null;
                })
              )}
            </svg>
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-8">
              <p className="font-label-mono text-xs opacity-80 uppercase tracking-widest">© 2025 AptiQuest. All rights reserved</p>
            </div>

            <div className="w-full overflow-hidden select-none pointer-events-none opacity-20">
              <h2 className="font-display-pixel text-[12vw] leading-none whitespace-nowrap text-center uppercase tracking-tighter">APTIQUEST</h2>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
