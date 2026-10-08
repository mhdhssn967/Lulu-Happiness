import React from 'react';
import { UserCircle } from 'lucide-react';
const logo = 'https://firebasestorage.googleapis.com/v0/b/gamefaktory-1b0b8.firebasestorage.app/o/lulu-happiness%2Fhappinesslogo.webp?alt=media';
import { useAppStore } from '../../store/useAppStore';

export default function Navbar() {
  const { user } = useAppStore();

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-transparent sticky top-0 z-50 transition-all">
      <div className="flex items-center gap-2">
        <img src={logo} alt="LuLu Happiness Logo" className="h-10 w-auto object-contain drop-shadow-md" />
      </div>
      <button className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
        <span className="font-medium text-sm max-w-[120px] truncate">{user?.name}</span>
        <UserCircle size={24} strokeWidth={1.5} />
      </button>
    </nav>
  );
}
