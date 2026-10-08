import React from 'react';
import { Home, Gift, Trophy, User } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();
  const path = location.pathname;

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Gift, label: 'My Rewards', path: '/rewards' },
    { icon: Trophy, label: 'Leaderboard', path: '/leaderboard' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-100 pb-safe pt-2 px-6 flex justify-between items-center shadow-[0_-4px_10px_rgba(0,0,0,0.03)] z-50">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = path === item.path;
        return (
          <Link key={item.label} to={item.path} className={`flex flex-col items-center gap-1 p-2 ${isActive ? 'text-lulu-green' : 'text-textMuted hover:text-lulu-green'} transition-colors`}>
            <Icon size={24} className={isActive ? 'fill-current' : ''} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
