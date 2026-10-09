import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Play } from 'lucide-react';
import ImageWithSkeleton from '../components/ImageWithSkeleton';

const gameImg1 = 'https://firebasestorage.googleapis.com/v0/b/gamefaktory-1b0b8.firebasestorage.app/o/lulu-happiness%2Fgame1icon.webp?alt=media';
const gameImg2 = 'https://firebasestorage.googleapis.com/v0/b/gamefaktory-1b0b8.firebasestorage.app/o/lulu-happiness%2Fmatchgameicon.webp?alt=media';

export default function GameHome() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Basic mock data for the game
  const gameData = {
    title: id === 'space-jump' ? 'Space Jump' : id === 'match' ? 'Match 3' : 'Mall Run',
    thumbnail: id === 'space-jump' ? gameImg1 : id === 'match' ? gameImg2 : 'https://firebasestorage.googleapis.com/v0/b/gamefaktory-1b0b8.firebasestorage.app/o/lulu-happiness%2Fimage%20copy%203.webp?alt=media',
    description: id === 'space-jump' 
      ? 'A thrilling 3D continuous upward jumper. Tilt your device to steer and reach the stars!' 
      : id === 'match' 
      ? 'A relaxing Zen Match 3 game. Match 3 identical tiles to clear them!'
      : 'Sprint through Lulu Mall! Dodge obstacles, collect coins, and run as far as you can!',
    rewards: 'Top 10 players win a Free Grillax Meal!'
  };

  return (
    <div className="flex-1 bg-transparent flex flex-col relative text-white animate-fade-in-up">
      <div className="p-4 flex items-center justify-between z-10 relative">
        <button 
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        >
          <ChevronLeft size={24} strokeWidth={2.5} className="text-white" />
        </button>
      </div>
      
      <div className="flex-1 flex flex-col px-5 pt-6 pb-10">
        
        {/* Header: Icon + Title */}
        <div className="flex items-center gap-4 w-full mb-8">
          <div className="w-20 h-20 shrink-0 rounded-2xl overflow-hidden shadow-[0_8px_16px_rgba(0,0,0,0.5)] border-2 border-white/10 relative">
            <ImageWithSkeleton src={gameData.thumbnail} alt={gameData.title} className="w-full h-full absolute inset-0" />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-black text-white tracking-tight leading-tight uppercase drop-shadow-md">
              {gameData.title}
            </h1>
            <span className="text-[11px] font-black text-happiness-lime uppercase tracking-widest mt-1">Free to Play</span>
          </div>
        </div>
        
        {/* Info Cards */}
        <div className="flex flex-col gap-4 w-full mb-8">
          
          <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 backdrop-blur-md rounded-3xl p-5 border border-blue-500/20 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
            <h3 className="font-black text-blue-300 mb-2 text-sm uppercase tracking-widest flex items-center gap-2 relative z-10">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span> How to Play
            </h3>
            <p className="text-white/90 text-sm font-medium leading-relaxed relative z-10">{gameData.description}</p>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-600/40 to-orange-600/20 backdrop-blur-md rounded-[24px] p-5 border border-yellow-500/30 shadow-[0_8px_20px_rgba(234,179,8,0.15)] relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl"></div>
            <h3 className="font-black text-yellow-400 mb-2 text-sm uppercase tracking-widest flex items-center gap-2 relative z-10">
              <span className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,1)] animate-pulse"></span> Weekly Prize
            </h3>
            <p className="text-white font-bold text-[15px] relative z-10">{gameData.rewards}</p>
          </div>
          
        </div>

        <div className="mt-2 w-full pt-2">
          <Link 
            to={`/play/${id}`}
            className="w-full relative overflow-hidden bg-gradient-to-r from-lulu-green to-[#0ba83f] shadow-[0_10px_30px_rgba(11,168,63,0.5)] rounded-2xl py-4 flex items-center justify-center gap-3 active:scale-[0.98] transition-transform"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 animate-[shine_2s_infinite_ease-in-out]"></div>
            <Play size={24} fill="white" className="text-white z-10" />
            <span className="text-white font-black text-xl tracking-wider uppercase z-10">Play Now</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
