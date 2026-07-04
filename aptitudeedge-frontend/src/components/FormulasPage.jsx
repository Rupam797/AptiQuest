import { useEffect, useState } from 'react';
import api from '../api';

function FormulasPage() {
  const [formulas, setFormulas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    api.get('/formulas')
      .then((res) => {
        setFormulas(res.data || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...new Set(formulas.map((f) => f.category).filter(Boolean))];

  const filteredFormulas = formulas.filter((f) => {
    const matchesCategory = selectedCategory === 'All' || f.category === selectedCategory;
    const matchesSearch = f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderContent = (content) => {
    return content.split('\n').map((line, idx) => {
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="text-sm font-bold text-terminal-black mt-4 mb-2 uppercase font-label-mono">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('#### ')) {
        return <h5 key={idx} className="text-xs font-semibold text-ui-slate mt-3 mb-1 uppercase font-label-mono">{line.replace('#### ', '')}</h5>;
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const cleanLine = line.substring(2);
        return (
          <li key={idx} className="list-disc list-inside ml-4 text-terminal-black mb-1 font-body-md">
            {parseBoldText(cleanLine)}
          </li>
        );
      }
      return <p key={idx} className="text-ui-slate leading-relaxed mb-2 font-body-md">{parseBoldText(line)}</p>;
    });
  };

  const parseBoldText = (text) => {
    const parts = text.split(/\*\*(.*?)\*\//g);
    return parts.map((part, i) => (i % 2 === 1 ? <strong key={i} className="text-terminal-black font-bold">{part}</strong> : part));
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-terminal-black font-label-mono text-sm uppercase tracking-widest animate-pulse">Loading Revision Hub...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Panel */}
      <div className="bg-white p-6 md:p-8 border-2 border-terminal-black pixel-corners shadow-[4px_4px_0px_#0F172A] space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-display-pixel uppercase text-terminal-black">Revision Hub & Formulas</h1>
          <p className="text-xs font-label-mono text-ui-slate uppercase">Quickly revise formulas, shortcuts, and key strategies for aptitude exams.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-ui-slate">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search formulas or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container border-2 border-terminal-black pixel-corners pl-10 pr-4 py-3 text-xs font-label-mono uppercase tracking-wider text-terminal-black focus:bg-white focus:outline-none focus:ring-0 transition"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 border-2 border-terminal-black font-label-mono text-xs uppercase pixel-corners shadow-[2px_2px_0px_#0F172A] active:translate-y-0.5 active:shadow-[1px_1px_0px_#0F172A] transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary text-white'
                    : 'bg-white text-terminal-black hover:bg-surface-container'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredFormulas.length === 0 ? (
          <div className="col-span-full bg-white border-2 border-terminal-black p-12 text-center text-ui-slate font-label-mono uppercase pixel-corners">
            No formulas found matching your search.
          </div>
        ) : (
          filteredFormulas.map((f) => (
            <div key={f.id} className="bg-white p-6 md:p-8 border-2 border-terminal-black pixel-corners shadow-[3px_3px_0px_#0F172A] space-y-4 hover:shadow-[4px_4px_0px_#0F172A] transition-all">
              <div className="flex justify-between items-start gap-4">
                <h3 className="text-lg font-bold text-terminal-black font-body-md uppercase">{f.title}</h3>
                <span className="bg-primary text-white text-[10px] font-label-mono px-2.5 py-1 border border-terminal-black pixel-corners-sm uppercase">
                  {f.category}
                </span>
              </div>
              <div className="text-sm bg-surface-container border-2 border-terminal-black rounded-none p-5 pixel-corners space-y-1">
                {renderContent(f.content)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default FormulasPage;
