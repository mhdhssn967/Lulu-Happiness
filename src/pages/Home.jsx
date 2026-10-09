import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Trophy, Gift, Lock, Play } from 'lucide-react';
import HeroCarousel from '../components/HeroCarousel';
import ImageWithSkeleton from '../components/ImageWithSkeleton';

const gameImg1 = 'https://firebasestorage.googleapis.com/v0/b/gamefaktory-1b0b8.firebasestorage.app/o/lulu-happiness%2Fspacejump.webp?alt=media';
const gameImg2 = 'https://firebasestorage.googleapis.com/v0/b/gamefaktory-1b0b8.firebasestorage.app/o/lulu-happiness%2Fmatch3.webp?alt=media';

const games = [
  { id: 'space-jump', title: 'Space Jump', thumbnail: gameImg1 },
  { id: 'match', title: 'Match 3', thumbnail: gameImg2 }
];

const recentWins = [
  { id: 1, name: 'ALEX H.', reward: 'Mouzy 50% Off' },
  { id: 2, name: 'PRIYA K.', reward: 'Free Grillax Meal' },
  { id: 3, name: 'RAHUL S.', reward: 'Ebadi 30% Off' },
  { id: 4, name: 'SARAH L.', reward: 'Cassava Voucher' },
  { id: 5, name: 'AMIT B.', reward: 'BIBA ₹500 Off' },
  { id: 6, name: 'JESSICA M.', reward: 'The Pulp Free Drink' },
  { id: 7, name: 'DAVID W.', reward: 'Free Belgian Fries' },
  { id: 8, name: 'SNEHA P.', reward: 'Ganga Spa 40% Off' },
  { id: 9, name: 'JOHN D.', reward: 'Kochi Kitchen Meal' },
  { id: 10, name: 'MARIA C.', reward: 'Toni&Guy Haircut' }
];

const initialColors = [
  'bg-gradient-to-br from-red-400 to-red-600 border-red-300', 
  'bg-gradient-to-br from-blue-400 to-blue-600 border-blue-300', 
  'bg-gradient-to-br from-emerald-400 to-emerald-600 border-emerald-300', 
  'bg-gradient-to-br from-amber-400 to-orange-500 border-amber-300', 
  'bg-gradient-to-br from-purple-400 to-purple-600 border-purple-300', 
  'bg-gradient-to-br from-pink-400 to-pink-600 border-pink-300', 
  'bg-gradient-to-br from-indigo-400 to-indigo-600 border-indigo-300', 
  'bg-gradient-to-br from-teal-400 to-teal-600 border-teal-300'
];

const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

const getColorForName = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return initialColors[Math.abs(hash) % initialColors.length];
};

export default function Home() {
  return (
    <div className="flex-1 pb-24 bg-transparent overflow-x-hidden relative z-10">
      {/* Hero Banner Carousel */}
      <HeroCarousel />
      
      {/* Recent Big Win */}
      <div className="mt-2 mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="px-4 flex items-center gap-2 mb-3">
          <Trophy size={20} className="text-[#3b82f6] drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
          <h2 className="text-[17px] font-bold text-white tracking-wide">Recent Wins</h2>
        </div>
        
        <div className="relative overflow-hidden w-full pb-2">
          
          <div className="animate-marquee-scroll gap-3 pl-4">
            {[...recentWins, ...recentWins].map((win, index) => (
              <div key={`${win.id}-${index}`} className="w-[170px] bg-[#141824] border border-white/5 rounded-2xl p-2 flex items-center gap-2.5 shadow-md hover:bg-[#1A1F2E] transition-all cursor-default">
                <div className={`w-10 h-10 rounded-[10px] shrink-0 flex items-center justify-center font-black text-white text-sm tracking-wider border shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_2px_8px_rgba(0,0,0,0.3)] drop-shadow-md ${getColorForName(win.name)}`}>
                  <span className="drop-shadow-md">{getInitials(win.name)}</span>
                </div>
                <div className="flex flex-col justify-center overflow-hidden w-full">
                  <span className="text-[11px] text-white/90 font-bold truncate w-full italic">{win.name}</span>
                  <span className="text-[10px] font-bold text-green-500 truncate w-full">{win.reward}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Game Selection */}
      <div className="px-4 pb-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <div className="flex justify-between items-center mb-4 px-1">
          <h2 className="text-lg font-bold text-white tracking-wide">Games</h2>
          <button className="text-happiness-lime font-medium text-sm hover:text-green-300 transition-colors">View All</button>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {games.map(game => (
            <Link 
              key={game.id} 
              to={`/game/${game.id}`}
              className="rounded-2xl relative aspect-[21/9] shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer border border-white/5 bg-[#141824] flex flex-col active:scale-95 hover:-translate-y-1 hover:border-happiness-lime/50 hover:shadow-[0_8px_15px_rgba(154,205,50,0.3)]"
            >
              <div className="absolute inset-0 w-full h-full">
                 <ImageWithSkeleton 
                   src={game.thumbnail} 
                   alt={game.title} 
                   className="w-full h-full"
                   imageClassName="transition-transform duration-700 group-hover:scale-105"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
              </div>
              
              <div className="absolute bottom-3 right-3 z-10">
                <div className="bg-happiness-lime text-[#05172e] w-11 h-11 rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(154,205,50,0.5)] border border-[#7EA82B] group-hover:scale-110 transition-transform">
                  <Play fill="currentColor" size={20} className="ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Modern Action Buttons */}
        <div className="mt-6 flex flex-col gap-3 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <Link 
            to="/rewards" 
            className="relative bg-gradient-to-r from-lulu-green to-[#0ba83f] shadow-[0_8px_20px_rgba(0,143,90,0.4)] rounded-2xl py-3.5 px-4 flex items-center justify-between text-white active:scale-95 transition-transform overflow-hidden group"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-[shine_3s_infinite_ease-in-out]"></div>
            <div className="flex items-center gap-3 z-10">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Gift size={22} strokeWidth={2} color="#fff" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-[16px] tracking-wide">Unlock Rewards</span>
                <span className="text-xs text-white/70 font-medium">Claim your daily bonuses</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center z-10">
              <ChevronRight size={18} />
            </div>
          </Link>
          
          <Link 
            to="/leaderboard" 
            className="relative bg-[#1A1F2E] border border-white/10 shadow-lg rounded-2xl py-3.5 px-4 flex items-center justify-between text-white active:scale-95 transition-transform hover:bg-[#202638]"
          >
            <div className="flex items-center gap-3 z-10">
              <div className="p-2 bg-yellow-500/20 rounded-xl">
                <Trophy size={22} strokeWidth={2} color="#EAB308" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-[16px] tracking-wide text-white">Global Leaderboard</span>
                <span className="text-xs text-white/50 font-medium">Rank up and win big</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center z-10">
              <ChevronRight size={18} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
