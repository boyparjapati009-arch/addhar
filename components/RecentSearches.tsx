import React from 'react';

interface RecentSearchesProps {
  title: string;
  searches: string[];
  onSearch: (query: string) => void;
}

const RecentSearches: React.FC<RecentSearchesProps> = ({ title, searches, onSearch }) => {
  if (!searches || searches.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-lg mt-6 animate-fade-in">
      <h3 className="text-sm font-semibold text-slate-400 mb-3 px-1">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {searches.map((search) => (
          <button
            key={search}
            onClick={() => onSearch(search)}
            className="px-4 py-1.5 bg-slate-800/60 hover:bg-slate-700/80 text-slate-300 hover:text-cyan-300 rounded-full text-sm transition-all duration-200 border border-slate-700 hover:border-cyan-500/50"
            aria-label={`Search for ${search}`}
          >
            {search}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentSearches;
