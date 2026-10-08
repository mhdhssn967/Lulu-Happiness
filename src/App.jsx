import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserCircle, Gamepad2, Gift, Trophy, Star, Zap, Coins, Ticket, TicketPercent, Puzzle, Joystick, Ghost, Bot, Sparkles, PartyPopper } from 'lucide-react';
import Navbar from './components/Layout/Navbar';
import Home from './pages/Home';
import Rewards from './pages/Rewards';
import Leaderboard from './pages/Leaderboard';
import GameHome from './pages/GameHome';
import GamePlayer from './pages/GamePlayer';
import SplashScreen from './components/SplashScreen';
import Onboarding from './pages/Onboarding';
import { useAppStore } from './store/useAppStore';
import './index.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const { user, setUser } = useAppStore();

  return (
    <Router>
      <div className="bg-[#05172e] min-h-[100dvh] flex justify-center">
        {/* Mobile App Container Wrapper */}
        <div className="w-full max-w-md bg-gradient-to-br from-[#05172e] via-[#0F3F73] to-[#164F8F] min-h-[100dvh] relative shadow-[0_0_50px_rgba(15,63,115,0.5)] flex flex-col overflow-x-hidden text-white">
          
          {/* Subtle Glowing Orbs (Brand colors) */}
          <div className="absolute top-[-15%] left-[-15%] w-[60%] h-[30%] bg-happiness-lime/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-[20%] right-[-20%] w-[50%] h-[40%] bg-blue-400/10 rounded-full blur-[100px] pointer-events-none"></div>

          {/* Blended Background Doodles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.05]">
            <Gamepad2 strokeWidth={1.2} className="absolute top-[10%] left-[5%] w-24 h-24 rotate-[-15deg]" />
            <TicketPercent strokeWidth={1.2} className="absolute top-[40%] right-[5%] w-28 h-28 rotate-[20deg]" />
            <Ghost strokeWidth={1.2} className="absolute bottom-[20%] left-[8%] w-20 h-20 rotate-[-10deg]" />
            <Puzzle strokeWidth={1.2} className="absolute top-[30%] right-[40%] w-16 h-16 rotate-[45deg]" />
            <Coins strokeWidth={1.2} className="absolute bottom-[10%] right-[15%] w-24 h-24 rotate-[15deg]" />
            <Sparkles strokeWidth={1.2} className="absolute top-[8%] right-[20%] w-14 h-14 rotate-[-25deg]" />
            
            <Joystick strokeWidth={1.2} className="absolute bottom-[35%] left-[25%] w-20 h-20 rotate-[35deg]" />
            <Bot strokeWidth={1.2} className="absolute top-[18%] left-[45%] w-16 h-16 rotate-[-45deg]" />
            <Ticket strokeWidth={1.2} className="absolute bottom-[8%] left-[40%] w-20 h-20 rotate-[15deg]" />
            <PartyPopper strokeWidth={1.2} className="absolute top-[55%] left-[12%] w-18 h-18 rotate-[-30deg]" />
            <Trophy strokeWidth={1.2} className="absolute top-[25%] right-[10%] w-16 h-16 rotate-[15deg]" />
            <Gamepad2 strokeWidth={1.2} className="absolute bottom-[50%] right-[30%] w-20 h-20 rotate-[45deg]" />
          </div>
          
          {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

          {!showSplash && !user ? (
            <Onboarding />
          ) : !showSplash && user ? (
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/rewards" element={<Rewards />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/game/:id" element={<GameHome />} />
                <Route path="/play/:id" element={<GamePlayer />} />
                <Route path="/profile" element={
                  <div className="flex-1 p-8 text-center pt-20 flex flex-col items-center">
                    <div className="w-24 h-24 bg-white text-happiness-blueDark rounded-full flex items-center justify-center text-4xl font-bold mb-4 shadow-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
                    <p className="text-white/70 font-medium mb-10">+91 {user.phone}</p>
                    <button 
                      onClick={() => setUser(null)}
                      className="px-6 py-2 bg-white text-lulu-red font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-md"
                    >
                      Log out
                    </button>
                  </div>
                } />
              </Routes>
            </>
          ) : null}
        </div>
      </div>
    </Router>
  );
}

export default App;
