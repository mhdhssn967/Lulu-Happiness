import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Lock, Unlock, Gift, Coffee, ShoppingBag, ShoppingCart, Gamepad2, Smartphone, Car, Utensils } from 'lucide-react';

// Mock user points for demonstration
const MOCK_POINTS = 12500;

const REWARDS_DATA = [
  {
    id: 1,
    brand: 'Starbucks',
    title: 'Free Handcrafted Drink',
    description: 'Redeem any tall or grande handcrafted beverage of your choice.',
    cost: 5000,
    icon: Coffee,
    color: 'from-emerald-500 to-green-700',
    bg: 'bg-emerald-950/30',
    border: 'border-emerald-500/20'
  },
  {
    id: 2,
    brand: 'Uber',
    title: '50% Off Next Ride',
    description: 'Get up to ₹200 off on your next Uber Premier or Go ride.',
    cost: 7500,
    icon: Car,
    color: 'from-gray-400 to-gray-600',
    bg: 'bg-gray-800/30',
    border: 'border-gray-500/20'
  },
  {
    id: 3,
    brand: 'Amazon',
    title: '₹500 Gift Voucher',
    description: 'Directly redeemable Amazon Pay gift voucher for your shopping.',
    cost: 10000,
    icon: ShoppingCart,
    color: 'from-yellow-400 to-orange-500',
    bg: 'bg-orange-950/30',
    border: 'border-orange-500/20'
  },
  {
    id: 4,
    brand: 'Zara',
    title: 'Flat 20% Off',
    description: 'Exclusive discount on Zara online or in-store apparel purchases.',
    cost: 15000,
    icon: ShoppingBag,
    color: 'from-slate-300 to-slate-500',
    bg: 'bg-slate-800/30',
    border: 'border-slate-500/20'
  },
  {
    id: 5,
    brand: 'PlayStation',
    title: '1-Month PS Plus',
    description: 'Access online multiplayer, exclusive discounts, and monthly free games.',
    cost: 25000,
    icon: Gamepad2,
    color: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-950/30',
    border: 'border-blue-500/20'
  },
  {
    id: 6,
    brand: 'Apple',
    title: '₹2000 Store Credit',
    description: 'Use for apps, games, music, movies, or iCloud+ storage.',
    cost: 50000,
    icon: Smartphone,
    color: 'from-zinc-200 to-zinc-400',
    bg: 'bg-zinc-800/30',
    border: 'border-zinc-500/20'
  },
  {
    id: 7,
    brand: 'Swiggy',
    title: '1 Year Swiggy One',
    description: 'Unlimited free deliveries and extra discounts on food and Instamart.',
    cost: 75000,
    icon: Utensils,
    color: 'from-orange-500 to-red-600',
    bg: 'bg-red-950/30',
    border: 'border-red-500/20'
  }
];

export default function Rewards() {
  const [redeemed, setRedeemed] = useState([]);
  
  const handleRedeem = (id) => {
    setRedeemed([...redeemed, id]);
  };

  return (
    <div className="flex-1 pb-24 bg-transparent overflow-x-hidden relative z-10 font-sans">
      
      {/* Premium Header */}
      <div className="p-4 pt-6 flex items-center justify-between sticky top-0 bg-[#05172e]/90 backdrop-blur-xl z-50 border-b border-white/5 shadow-sm">
        <Link 
          to="/" 
          className="w-11 h-11 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors shadow-sm"
        >
          <ChevronLeft size={24} className="text-white drop-shadow-sm" />
        </Link>
        
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-xl font-black text-white tracking-wide drop-shadow-md">Rewards Center</h1>
          <p className="text-[10px] font-black text-white/50 tracking-widest uppercase">Redeem Points</p>
        </div>
        
        {/* Points Balance Badge */}
        <div className="bg-gradient-to-br from-yellow-400/20 to-orange-500/20 px-3 py-2 rounded-2xl border border-yellow-500/30 flex flex-col items-center justify-center min-w-[70px] shadow-[0_0_15px_rgba(234,179,8,0.15)]">
          <div className="flex items-center gap-1">
            <Gift size={14} className="text-yellow-400 drop-shadow-sm" />
            <span className="text-white font-black text-sm tracking-tight">{MOCK_POINTS.toLocaleString()}</span>
          </div>
          <span className="text-[9px] font-bold text-yellow-400/80 uppercase">Balance</span>
        </div>
      </div>
      
      {/* Content Body */}
      <div className="px-5 mt-6 animate-fade-in-up">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl"></div>
          <h2 className="text-white font-bold text-lg mb-1 relative z-10">Turn points into prizes!</h2>
          <p className="text-white/60 text-sm font-medium leading-relaxed relative z-10 pr-4">
            Play games, climb the leaderboard, and earn points to unlock exclusive vouchers from premium brands.
          </p>
        </div>
        
        <div className="flex flex-col gap-5">
          {REWARDS_DATA.map((reward, index) => {
            const isUnlocked = MOCK_POINTS >= reward.cost;
            const progress = Math.min((MOCK_POINTS / reward.cost) * 100, 100);
            const isRedeemed = redeemed.includes(reward.id);
            const Icon = reward.icon;
            
            return (
              <div 
                key={reward.id} 
                className={`relative rounded-[24px] overflow-hidden border ${reward.border} ${reward.bg} backdrop-blur-md p-5 transition-all duration-500 ${!isUnlocked ? 'opacity-[0.85] grayscale-[20%]' : 'shadow-lg hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:-translate-y-1'}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Decorative Background Blob */}
                <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full bg-gradient-to-br ${reward.color} opacity-10 blur-2xl pointer-events-none`}></div>
                
                {/* Brand Header */}
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-14 h-14 rounded-[18px] bg-gradient-to-br ${reward.color} flex items-center justify-center shadow-[inset_0_2px_10px_rgba(255,255,255,0.3)] border border-white/10`}>
                      <Icon size={26} strokeWidth={2} className="text-white drop-shadow-md" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h3 className="text-white/60 font-black text-[11px] uppercase tracking-widest mb-0.5">{reward.brand}</h3>
                      <h2 className="text-white font-black text-[17px] leading-tight drop-shadow-sm">{reward.title}</h2>
                    </div>
                  </div>
                </div>
                
                <p className="text-white/70 text-sm mb-6 font-medium leading-relaxed relative z-10">
                  {reward.description}
                </p>
                
                {/* Progress & Value */}
                <div className="flex flex-col gap-3.5 relative z-10">
                  
                  {/* Points Cost / Progress Text */}
                  <div className="flex items-end justify-between font-bold mb-1">
                    <div className="flex flex-col">
                      <span className="text-white/40 text-[10px] uppercase tracking-widest mb-0.5">Required</span>
                      <span className="text-yellow-400 font-black text-lg leading-none">{reward.cost.toLocaleString()} <span className="text-[11px] text-yellow-400/60 uppercase">pts</span></span>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <span className={isUnlocked ? 'text-green-400 text-[11px] uppercase tracking-widest mb-0.5' : 'text-white/40 text-[11px] uppercase tracking-widest mb-0.5'}>
                        {isUnlocked ? 'Goal Reached' : 'Progress'}
                      </span>
                      <span className="text-white/90 text-lg leading-none font-black">{Math.floor(progress)}%</span>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="h-2.5 w-full bg-black/40 rounded-full overflow-hidden shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)] border border-white/5">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden bg-gradient-to-r ${isUnlocked ? 'from-green-400 to-green-500 shadow-[0_0_10px_rgba(74,222,128,0.5)]' : 'from-yellow-400 to-orange-500'}`}
                      style={{ width: `${progress}%` }}
                    >
                      {/* Shine effect on progress bar */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 -translate-x-full animate-[shine_2s_infinite_ease-in-out]"></div>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <button 
                    onClick={() => isUnlocked && !isRedeemed && handleRedeem(reward.id)}
                    disabled={!isUnlocked || isRedeemed}
                    className={`mt-2 w-full py-4 rounded-2xl font-black text-[15px] uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 shadow-sm
                      ${isRedeemed 
                        ? 'bg-white/5 text-white/40 border border-white/5 cursor-not-allowed'
                        : isUnlocked 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-[0_8px_20px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-95 border border-green-400/30' 
                          : 'bg-[#0f172a]/60 text-white/30 border border-white/5 cursor-not-allowed'
                      }
                    `}
                  >
                    {isRedeemed ? (
                      <>Claimed</>
                    ) : isUnlocked ? (
                      <>
                        <Unlock size={20} />
                        Redeem Reward
                      </>
                    ) : (
                      <>
                        <Lock size={20} />
                        Locked
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
