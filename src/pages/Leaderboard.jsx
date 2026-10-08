import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function Leaderboard() {
  return (
    <div className="flex-1 bg-transparent flex flex-col relative text-white">
      <div className="p-4">
        <Link 
          to="/" 
          className="inline-flex bg-happiness-lime text-happiness-blueDark border-b-[4px] border-[#7EA82B] rounded-xl py-2 px-3 items-center justify-center gap-1 font-bold text-sm active:border-b-0 active:translate-y-[4px] transition-all shadow-md"
        >
          <ChevronLeft size={18} strokeWidth={3} /> Home
        </Link>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-8 pb-32 text-center text-white/70">
        <h2 className="text-3xl font-['Luckiest_Guy'] text-white mb-2 tracking-wide drop-shadow-md">Leaderboard</h2>
        <p>Full leaderboard functionality coming soon.</p>
      </div>
    </div>
  );
}
