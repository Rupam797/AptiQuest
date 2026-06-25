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
        return <h4 key={idx} className="text-base font-bold text-slate-900 mt-4 mb-2">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('#### ')) {
        return <h5 key={idx} className="text-sm font-semibold text-slate-800 mt-3 mb-1">{line.replace('#### ', '')}</h5>;
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const cleanLine = line.substring(2);
        return (
          <li key={idx} className="list-disc list-inside ml-4 text-slate-700 mb-1">
            {parseBoldText(cleanLine)}
          </li>
        );
      }
      return <p key={idx} className="text-slate-650 leading-relaxed mb-2">{parseBoldText(line)}</p>;
    });
  };

  const parseBoldText = (text) => {
    const parts = text.split(/\*\*(.*?)\*\//g);
    return parts.map((part, i) => (i % 2 === 1 ? <strong key={i} className="text-slate-950 font-bold">{part}</strong> : part));
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-slate-600 font-semibold text-lg animate-pulse">Loading Revision Hub...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Panel */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900">Revision Hub & Formulas</h1>
          <p className="text-sm text-slate-500">Quickly revise formulas, shortcuts, and key strategies for aptitude exams.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search formulas or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition"
            />
          </div>

          <div className="flex items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition ${
                  selectedCategory === cat
                    ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                    : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
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
          <div className="col-span-full bg-white rounded-3xl p-12 border border-slate-100 text-center text-slate-500">
            No formulas found matching your search.
          </div>
        ) : (
          filteredFormulas.map((f) => (
            <div key={f.id} className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition">
              <div className="flex justify-between items-start gap-4">
                <h3 className="text-lg font-bold text-slate-900">{f.title}</h3>
                <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-100">
                  {f.category}
                </span>
              </div>
              <div className="text-sm bg-slate-50 rounded-2xl p-5 border border-slate-200/50 space-y-1">
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
