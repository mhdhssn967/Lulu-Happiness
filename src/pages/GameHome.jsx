import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Play } from 'lucide-react';
const gameImg1 = 'https://firebasestorage.googleapis.com/v0/b/gamefaktory-1b0b8.firebasestorage.app/o/lulu-happiness%2Fgame1icon.webp?alt=media';

export default function GameHome() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Basic mock data for the game
  const gameData = {
    title: id === 'space-jump' ? 'Space Jump' : id,
    thumbnail: gameImg1,
    description: 'A thrilling 3D continuous upward jumper. Tilt your device to steer and reach the stars!',
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
      
      <div className="flex-1 flex flex-col items-center px-6 pt-2 pb-10">
        <div className="w-full aspect-square rounded-3xl overflow-hidden shadow-2xl relative mb-6 border-[3px] border-white/10">
          <img src={gameData.thumbnail} alt={gameData.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1128] via-transparent to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4">
            <h1 className="text-4xl font-black text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] tracking-tight uppercase">
              {gameData.title}
            </h1>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 w-full mb-8 border border-white/5 shadow-lg">
          <h3 className="font-bold text-happiness-lime mb-2 text-sm uppercase tracking-wider">How to play</h3>
          <p className="text-white/80 text-sm leading-relaxed mb-4">{gameData.description}</p>
          
          <div className="h-[1px] w-full bg-white/10 my-4"></div>
          
          <h3 className="font-bold text-yellow-400 mb-1 text-sm uppercase tracking-wider">Weekly Prize</h3>
          <p className="text-white font-bold">{gameData.rewards}</p>
        </div>

        <div className="mt-auto w-full pt-4">
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
