import React from 'react';

interface NumberSearchCardProps {
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

const NumberSearchCard: React.FC<NumberSearchCardProps> = ({
  phoneNumber,
  setPhoneNumber,
  onSearch,
  isLoading,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <div className="w-full max-w-lg p-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 shadow-lg shadow-purple-500/10">
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-[14px] p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="Enter 10-digit Mobile Number"
            className="flex-grow w-full px-4 py-3 bg-slate-900/50 rounded-lg border border-slate-700 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 outline-none shadow-inner shadow-black/20"
            disabled={isLoading}
            maxLength={10}
            pattern="\d{10}"
            title="Mobile number must be 10 digits."
          />
          <button
            type="submit"
            disabled={isLoading}
            className="relative inline-flex items-center justify-center px-8 py-3 font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 ease-in-out transform hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none overflow-hidden group"
          >
            {isLoading ? 'Searching...' : 'Search'}
            <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 mix-blend-soft-light"></span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default NumberSearchCard;
