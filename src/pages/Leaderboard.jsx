import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Trophy, Medal, Star, Flame } from 'lucide-react';

const names = [
  "Alex Hunter", "Sarah Jenkins", "Michael Chen", "Emma Watson", "David Kim", 
  "Priya Patel", "James Wilson", "Sophia Martinez", "Robert Garcia", "Olivia Davis", 
  "William Rodriguez", "Isabella Moore", "Richard Hernandez", "Mia Jackson", "Joseph Martin", 
  "Charlotte Lee", "Thomas Perez", "Amelia Thompson", "Charles White", "Harper Harris", 
  "Christopher Clark", "Evelyn Lewis", "Daniel Robinson", "Abigail Walker", "Matthew Hall", 
  "Emily Allen", "Anthony Young", "Elizabeth King", "Donald Wright", "Sofia Scott", 
  "Mark Torres", "Avery Nguyen", "Paul Hill", "Ella Flores", "Steven Green", 
  "Scarlett Adams", "Andrew Nelson", "Grace Baker", "Kenneth Hall", "Chloe Rivera", 
  "Joshua Campbell", "Victoria Mitchell", "Kevin Carter", "Riley Roberts", "Brian Gomez", 
  "Aria Phillips", "George Evans", "Lily Turner", "Edward Diaz", "Zoey Foster"
];

const initialColors = [
  'bg-red-500', 
  'bg-blue-500', 
  'bg-emerald-500', 
  'bg-orange-500', 
  'bg-purple-500', 
  'bg-pink-500', 
  'bg-indigo-500', 
  'bg-teal-500'
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

export default function Leaderboard() {
  
  // Generate deterministic leaderboard data based on the names list
  const leaderboardData = useMemo(() => {
    return names.map((name, index) => {
      // Create a descending curve for high scores
      const multiplier = Math.pow(0.93, index);
      const highScore = Math.floor(85000 * multiplier) + Math.floor(Math.random() * 500);
      
      // Total score is a factor of high score (randomized to show playtime differences)
      const playFactor = 2 + (Math.abs(Math.sin(index)) * 8); // random multiplier between 2 and 10
      const totalScore = Math.floor(highScore * playFactor);
      
      return {
        rank: index + 1,
        name,
        highScore,
        totalScore
      };
    }).sort((a, b) => b.highScore - a.highScore).map((user, index) => ({...user, rank: index + 1}));
  }, []);

  const topThree = leaderboardData.slice(0, 3);
  const remaining = leaderboardData.slice(3);

  return (
    <div className="flex-1 pb-24 bg-transparent overflow-x-hidden relative z-10 font-sans">
      
      {/* Header */}
      <div className="p-4 pt-6 flex items-center justify-between sticky top-0 bg-transparent z-50">
        <Link 
          to="/" 
          className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 transition-colors"
        >
          <ChevronLeft size={24} className="text-white" />
        </Link>
        
        <div className="flex flex-col items-center justify-center absolute left-1/2 -translate-x-1/2">
          <h1 className="text-lg font-bold text-white tracking-wide">Global Ranking</h1>
          <p className="text-[10px] font-bold text-yellow-400 tracking-widest uppercase">Season 1</p>
        </div>
      </div>

      <div className="px-4 mt-2 w-full max-w-md mx-auto">
        
        {/* Podium for Top 3 */}
        <div className="flex items-end justify-center gap-6 mb-12 mt-6">
          
          {/* 2nd Place */}
          <div className="flex flex-col items-center relative w-24">
            <div className={`w-16 h-16 rounded-full border-4 border-slate-400 ${getColorForName(topThree[1].name)} flex items-center justify-center mb-3 relative`}>
               <div className="absolute -bottom-2 bg-slate-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-[#05172e]">2</div>
               <span className="text-white font-bold text-xl">{getInitials(topThree[1].name)}</span>
            </div>
            <span className="text-white font-bold text-sm truncate w-full text-center">{topThree[1].name.split(' ')[0]}</span>
            <span className="text-slate-400 font-medium text-xs mt-0.5">{topThree[1].highScore.toLocaleString()}</span>
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center relative w-28 -mb-4">
            <Trophy size={20} className="text-yellow-400 mb-2" />
            <div className={`w-20 h-20 rounded-full border-4 border-yellow-400 ${getColorForName(topThree[0].name)} flex items-center justify-center mb-3 relative`}>
               <div className="absolute -bottom-2 bg-yellow-500 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-[#05172e]">1</div>
               <span className="text-white font-bold text-2xl">{getInitials(topThree[0].name)}</span>
            </div>
            <span className="text-white font-bold text-base truncate w-full text-center">{topThree[0].name.split(' ')[0]}</span>
            <span className="text-yellow-400 font-bold text-sm mt-0.5">{topThree[0].highScore.toLocaleString()}</span>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center relative w-24">
            <div className={`w-16 h-16 rounded-full border-4 border-amber-600 ${getColorForName(topThree[2].name)} flex items-center justify-center mb-3 relative`}>
               <div className="absolute -bottom-2 bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-[#05172e]">3</div>
               <span className="text-white font-bold text-xl">{getInitials(topThree[2].name)}</span>
            </div>
            <span className="text-white font-bold text-sm truncate w-full text-center">{topThree[2].name.split(' ')[0]}</span>
            <span className="text-amber-500 font-medium text-xs mt-0.5">{topThree[2].highScore.toLocaleString()}</span>
          </div>
          
        </div>

        {/* List Header */}
        <div className="flex items-center px-4 mb-2 text-white/40 text-[10px] font-bold uppercase tracking-wider">
          <div className="w-8 text-center mr-2">#</div>
          <div className="flex-1">Player</div>
          <div className="w-16 text-right mr-4">Total</div>
          <div className="w-16 text-right">High</div>
        </div>

        {/* Remaining Ranks (4-50) */}
        <div className="flex flex-col bg-[#0b1b36] rounded-3xl overflow-hidden border border-white/5 mb-8">
          {remaining.map((user, index) => (
            <div 
              key={user.rank}
              className={`flex items-center px-4 py-3 ${index !== remaining.length - 1 ? 'border-b border-white/5' : ''}`}
            >
              <div className="w-8 text-center text-white/50 font-bold mr-2 text-sm">
                {user.rank}
              </div>
              
              <div className="flex items-center gap-3 flex-1 overflow-hidden">
                <div className={`w-9 h-9 shrink-0 rounded-full ${getColorForName(user.name)} flex items-center justify-center text-white text-[11px] font-bold`}>
                  {getInitials(user.name)}
                </div>
                <span className="text-white font-semibold text-sm truncate">{user.name}</span>
              </div>
              
              <div className="w-16 text-right mr-4">
                <span className="text-white/60 font-medium text-xs">{user.totalScore.toLocaleString()}</span>
              </div>
              
              <div className="w-16 text-right">
                <span className="text-white font-bold text-sm">{user.highScore.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
