import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import logo from '../assets/happinesslogo.webp';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import HeroCarousel from '../components/HeroCarousel';

export default function Onboarding() {
  const { setUser } = useAppStore();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (phone.length === 10) setStep(2);
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (name.trim().length > 0) {
      setUser({ name: name.trim(), phone });
      
      // Force Fullscreen
      try {
        const docEl = document.documentElement;
        if (docEl.requestFullscreen) {
          docEl.requestFullscreen().catch(() => {});
        } else if (docEl.webkitRequestFullscreen) {
          docEl.webkitRequestFullscreen().catch(() => {});
        }
      } catch (err) {
        console.warn('Fullscreen request failed', err);
      }
    }
  };

  return (
    <div className="flex-1 bg-transparent flex flex-col items-center justify-center p-6 relative">
      <div className="w-full max-w-sm z-10 flex flex-col items-center">
        <img src={logo} alt="LuLu Happiness Logo" className="w-48 mb-4 object-contain" />
        
        <div className="w-full mb-6">
          <HeroCarousel />
        </div>
        
        <div className="bg-white rounded-3xl shadow-xl w-full p-8 border border-gray-50 relative overflow-hidden">
          {/* Progress Indicator */}
          <div className="flex gap-2 mb-8">
            <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-lulu-green' : 'bg-gray-200'}`} />
            <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-lulu-green' : 'bg-gray-200'}`} />
          </div>

          {step === 1 ? (
            <div className="animate-[fadeIn_0.3s_ease-out]">
              <h2 className="text-2xl font-bold text-happiness-blueDark mb-2">Welcome Back!</h2>
              <p className="text-textMuted text-sm mb-6">Enter your mobile number to start earning rewards.</p>
              
              <form onSubmit={handlePhoneSubmit}>
                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-lulu-green transition-colors mb-6 bg-gray-50">
                  <div className="px-4 py-3 font-semibold text-gray-600 bg-gray-100 border-r border-gray-200">
                    +91
                  </div>
                  <input 
                    type="tel"
                    placeholder="Enter 10 digit number"
                    className="flex-1 px-4 py-3 bg-transparent outline-none font-medium text-textDark placeholder-gray-400"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    autoFocus
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={phone.length !== 10}
                  className="w-full bg-lulu-green hover:bg-lulu-greenLight disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  Continue <ArrowRight size={20} />
                </button>
              </form>
            </div>
          ) : (
            <div className="animate-[fadeIn_0.3s_ease-out]">
              <h2 className="text-2xl font-bold text-happiness-blueDark mb-2">Almost there!</h2>
              <p className="text-textMuted text-sm mb-6">What should we call you?</p>
              
              <form onSubmit={handleNameSubmit}>
                <input 
                  type="text"
                  placeholder="Your Full Name"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-lulu-green transition-colors mb-6 bg-gray-50 font-medium text-textDark placeholder-gray-400"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
                <button 
                  type="submit" 
                  disabled={!name.trim()}
                  className="w-full bg-happiness-blue hover:bg-happiness-blueDark disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  Join LuLu Happiness <CheckCircle2 size={20} />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
