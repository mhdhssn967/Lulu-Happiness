import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, RotateCcw, Trophy, Play, Shuffle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TILE_TYPES = ['🍎', '🧀', '🍉', '💎', '🌸', '🥝', '🍬', '🥑', '🍔', '🍕', '🍩', '🍟', '🍇', '🍒', '🍓'];

const LEVELS = [
  // Level 1: 30 tiles (Original 1)
  [
    {x: 2, y: 2, z: 0}, {x: 4, y: 2, z: 0}, {x: 6, y: 2, z: 0}, {x: 8, y: 2, z: 0},
    {x: 2, y: 4, z: 0}, {x: 4, y: 4, z: 0}, {x: 6, y: 4, z: 0}, {x: 8, y: 4, z: 0},
    {x: 2, y: 6, z: 0}, {x: 4, y: 6, z: 0}, {x: 6, y: 6, z: 0}, {x: 8, y: 6, z: 0},
    {x: 2, y: 8, z: 0}, {x: 4, y: 8, z: 0}, {x: 6, y: 8, z: 0}, {x: 8, y: 8, z: 0},
    {x: 3, y: 3, z: 1}, {x: 5, y: 3, z: 1}, {x: 7, y: 3, z: 1},
    {x: 3, y: 5, z: 1}, {x: 5, y: 5, z: 1}, {x: 7, y: 5, z: 1},
    {x: 3, y: 7, z: 1}, {x: 5, y: 7, z: 1}, {x: 7, y: 7, z: 1},
    {x: 4, y: 4, z: 2}, {x: 6, y: 4, z: 2}, {x: 4, y: 6, z: 2}, {x: 6, y: 6, z: 2},
    {x: 5, y: 5, z: 3}
  ],
  // Level 2: 24 tiles (Original 2)
  [
    {x: 2, y: 2, z: 0}, {x: 4, y: 2, z: 0}, {x: 6, y: 2, z: 0}, {x: 8, y: 2, z: 0},
    {x: 2, y: 4, z: 0},                                         {x: 8, y: 4, z: 0},
    {x: 2, y: 6, z: 0},                                         {x: 8, y: 6, z: 0},
    {x: 2, y: 8, z: 0}, {x: 4, y: 8, z: 0}, {x: 6, y: 8, z: 0}, {x: 8, y: 8, z: 0},
    {x: 3, y: 3, z: 1}, {x: 5, y: 3, z: 1}, {x: 7, y: 3, z: 1},
    {x: 3, y: 7, z: 1}, {x: 5, y: 7, z: 1}, {x: 7, y: 7, z: 1},
    {x: 4, y: 2, z: 2}, {x: 6, y: 2, z: 2},
    {x: 4, y: 8, z: 2}, {x: 6, y: 8, z: 2},
    {x: 5, y: 2, z: 3}, {x: 5, y: 8, z: 3}
  ],
  // Level 3: 36 tiles (Original 3)
  [
    {x: 2, y: 2, z: 0}, {x: 4, y: 2, z: 0}, {x: 6, y: 2, z: 0}, {x: 8, y: 2, z: 0},
    {x: 2, y: 4, z: 0}, {x: 4, y: 4, z: 0}, {x: 6, y: 4, z: 0}, {x: 8, y: 4, z: 0},
    {x: 2, y: 6, z: 0}, {x: 4, y: 6, z: 0}, {x: 6, y: 6, z: 0}, {x: 8, y: 6, z: 0},
    {x: 2, y: 8, z: 0}, {x: 4, y: 8, z: 0}, {x: 6, y: 8, z: 0}, {x: 8, y: 8, z: 0},
    {x: 3, y: 3, z: 1}, {x: 3, y: 5, z: 1}, {x: 3, y: 7, z: 1},
    {x: 7, y: 3, z: 1}, {x: 7, y: 5, z: 1}, {x: 7, y: 7, z: 1},
    {x: 2, y: 5, z: 2}, {x: 4, y: 5, z: 2},
    {x: 6, y: 5, z: 2}, {x: 8, y: 5, z: 2},
    {x: 3, y: 4, z: 3}, {x: 3, y: 6, z: 3},
    {x: 7, y: 4, z: 3}, {x: 7, y: 6, z: 3},
    {x: 3, y: 5, z: 4}, {x: 7, y: 5, z: 4},
    {x: 5, y: 5, z: 0}, {x: 5, y: 5, z: 1}, {x: 5, y: 5, z: 2}, {x: 5, y: 5, z: 3}
  ],
  // Level 4: Diamond (24 tiles)
  [
    {x: 5, y: 1, z: 0}, {x: 4, y: 2, z: 0}, {x: 6, y: 2, z: 0}, {x: 3, y: 3, z: 0}, {x: 7, y: 3, z: 0}, {x: 2, y: 4, z: 0}, {x: 8, y: 4, z: 0}, {x: 1, y: 5, z: 0}, {x: 9, y: 5, z: 0}, {x: 2, y: 6, z: 0}, {x: 8, y: 6, z: 0}, {x: 3, y: 7, z: 0}, {x: 7, y: 7, z: 0}, {x: 4, y: 8, z: 0}, {x: 6, y: 8, z: 0}, {x: 5, y: 9, z: 0},
    {x: 5, y: 3, z: 1}, {x: 4, y: 4, z: 1}, {x: 6, y: 4, z: 1}, {x: 3, y: 5, z: 1}, {x: 7, y: 5, z: 1}, {x: 4, y: 6, z: 1}, {x: 6, y: 6, z: 1}, {x: 5, y: 7, z: 1}
  ],
  // Level 5: Four Squares (36 tiles)
  [
    {x: 2, y: 2, z: 0}, {x: 3, y: 2, z: 0}, {x: 2, y: 3, z: 0}, {x: 3, y: 3, z: 0},
    {x: 7, y: 2, z: 0}, {x: 8, y: 2, z: 0}, {x: 7, y: 3, z: 0}, {x: 8, y: 3, z: 0},
    {x: 2, y: 7, z: 0}, {x: 3, y: 7, z: 0}, {x: 2, y: 8, z: 0}, {x: 3, y: 8, z: 0},
    {x: 7, y: 7, z: 0}, {x: 8, y: 7, z: 0}, {x: 7, y: 8, z: 0}, {x: 8, y: 8, z: 0},
    
    {x: 2, y: 2, z: 1}, {x: 3, y: 2, z: 1}, {x: 2, y: 3, z: 1}, {x: 3, y: 3, z: 1},
    {x: 7, y: 2, z: 1}, {x: 8, y: 2, z: 1}, {x: 7, y: 3, z: 1}, {x: 8, y: 3, z: 1},
    {x: 2, y: 7, z: 1}, {x: 3, y: 7, z: 1}, {x: 2, y: 8, z: 1}, {x: 3, y: 8, z: 1},
    {x: 7, y: 7, z: 1}, {x: 8, y: 7, z: 1}, {x: 7, y: 8, z: 1}, {x: 8, y: 8, z: 1},

    {x: 4, y: 4, z: 0}, {x: 5, y: 4, z: 0}, {x: 4, y: 5, z: 0}, {x: 5, y: 5, z: 0}
  ],
  // Level 6: Pyramid (33 tiles)
  [
    {x: 4, y: 3, z: 0}, {x: 5, y: 3, z: 0}, {x: 6, y: 3, z: 0}, 
    {x: 3, y: 4, z: 0}, {x: 4, y: 4, z: 0}, {x: 5, y: 4, z: 0}, {x: 6, y: 4, z: 0}, {x: 7, y: 4, z: 0},
    {x: 3, y: 5, z: 0}, {x: 4, y: 5, z: 0}, {x: 5, y: 5, z: 0}, {x: 6, y: 5, z: 0}, {x: 7, y: 5, z: 0},
    {x: 3, y: 6, z: 0}, {x: 4, y: 6, z: 0}, {x: 5, y: 6, z: 0}, {x: 6, y: 6, z: 0}, {x: 7, y: 6, z: 0},
    {x: 4, y: 7, z: 0}, {x: 5, y: 7, z: 0}, {x: 6, y: 7, z: 0},
    
    {x: 4, y: 4, z: 1}, {x: 5, y: 4, z: 1}, {x: 6, y: 4, z: 1},
    {x: 4, y: 5, z: 1}, {x: 5, y: 5, z: 1}, {x: 6, y: 5, z: 1},
    {x: 4, y: 6, z: 1}, {x: 5, y: 6, z: 1}, {x: 6, y: 6, z: 1},
    
    {x: 5, y: 5, z: 2},
    {x: 5, y: 5, z: 3},
    {x: 5, y: 5, z: 4}
  ],
  // Level 7: Two Towers (42 tiles)
  [
    {x: 3, y: 3, z: 0}, {x: 3, y: 4, z: 0}, {x: 3, y: 5, z: 0}, {x: 3, y: 6, z: 0}, {x: 3, y: 7, z: 0},
    {x: 7, y: 3, z: 0}, {x: 7, y: 4, z: 0}, {x: 7, y: 5, z: 0}, {x: 7, y: 6, z: 0}, {x: 7, y: 7, z: 0},
    
    {x: 3, y: 3, z: 1}, {x: 3, y: 4, z: 1}, {x: 3, y: 5, z: 1}, {x: 3, y: 6, z: 1}, {x: 3, y: 7, z: 1},
    {x: 7, y: 3, z: 1}, {x: 7, y: 4, z: 1}, {x: 7, y: 5, z: 1}, {x: 7, y: 6, z: 1}, {x: 7, y: 7, z: 1},

    {x: 3, y: 3, z: 2}, {x: 3, y: 4, z: 2}, {x: 3, y: 5, z: 2}, {x: 3, y: 6, z: 2}, {x: 3, y: 7, z: 2},
    {x: 7, y: 3, z: 2}, {x: 7, y: 4, z: 2}, {x: 7, y: 5, z: 2}, {x: 7, y: 6, z: 2}, {x: 7, y: 7, z: 2},

    {x: 3, y: 3, z: 3}, {x: 3, y: 4, z: 3}, {x: 3, y: 5, z: 3}, {x: 3, y: 6, z: 3}, {x: 3, y: 7, z: 3},
    {x: 7, y: 3, z: 3}, {x: 7, y: 4, z: 3}, {x: 7, y: 5, z: 3}, {x: 7, y: 6, z: 3}, {x: 7, y: 7, z: 3},

    {x: 5, y: 5, z: 0}, {x: 5, y: 5, z: 1}
  ],
  // Level 8: X Shape (27 tiles)
  [
    {x: 2, y: 2, z: 0}, {x: 3, y: 3, z: 0}, {x: 4, y: 4, z: 0}, {x: 5, y: 5, z: 0}, {x: 6, y: 6, z: 0}, {x: 7, y: 7, z: 0}, {x: 8, y: 8, z: 0},
    {x: 2, y: 8, z: 0}, {x: 3, y: 7, z: 0}, {x: 4, y: 6, z: 0}, {x: 6, y: 4, z: 0}, {x: 7, y: 3, z: 0}, {x: 8, y: 2, z: 0},
    
    {x: 2, y: 2, z: 1}, {x: 3, y: 3, z: 1}, {x: 4, y: 4, z: 1}, {x: 5, y: 5, z: 1}, {x: 6, y: 6, z: 1}, {x: 7, y: 7, z: 1}, {x: 8, y: 8, z: 1},
    {x: 2, y: 8, z: 1}, {x: 3, y: 7, z: 1}, {x: 4, y: 6, z: 1}, {x: 6, y: 4, z: 1}, {x: 7, y: 3, z: 1}, {x: 8, y: 2, z: 1},
    
    {x: 5, y: 5, z: 2}
  ],
  // Level 9: Hollow Box (33 tiles)
  [
    {x: 3, y: 3, z: 0}, {x: 4, y: 3, z: 0}, {x: 5, y: 3, z: 0}, {x: 6, y: 3, z: 0}, {x: 7, y: 3, z: 0},
    {x: 3, y: 4, z: 0},                                                             {x: 7, y: 4, z: 0},
    {x: 3, y: 5, z: 0},                                                             {x: 7, y: 5, z: 0},
    {x: 3, y: 6, z: 0},                                                             {x: 7, y: 6, z: 0},
    {x: 3, y: 7, z: 0}, {x: 4, y: 7, z: 0}, {x: 5, y: 7, z: 0}, {x: 6, y: 7, z: 0}, {x: 7, y: 7, z: 0},
    
    {x: 3, y: 3, z: 1}, {x: 4, y: 3, z: 1}, {x: 5, y: 3, z: 1}, {x: 6, y: 3, z: 1}, {x: 7, y: 3, z: 1},
    {x: 3, y: 4, z: 1},                                                             {x: 7, y: 4, z: 1},
    {x: 3, y: 5, z: 1},                                                             {x: 7, y: 5, z: 1},
    {x: 3, y: 6, z: 1},                                                             {x: 7, y: 6, z: 1},
    {x: 3, y: 7, z: 1}, {x: 4, y: 7, z: 1}, {x: 5, y: 7, z: 1}, {x: 6, y: 7, z: 1}, {x: 7, y: 7, z: 1},

    {x: 5, y: 5, z: 0}
  ],
  // Level 10: Checkerboard (30 tiles)
  [
    {x: 2, y: 2, z: 0}, {x: 4, y: 2, z: 0}, {x: 6, y: 2, z: 0}, {x: 8, y: 2, z: 0},
    {x: 3, y: 3, z: 0}, {x: 5, y: 3, z: 0}, {x: 7, y: 3, z: 0},
    {x: 2, y: 4, z: 0}, {x: 4, y: 4, z: 0}, {x: 6, y: 4, z: 0}, {x: 8, y: 4, z: 0},
    {x: 3, y: 5, z: 0}, {x: 5, y: 5, z: 0}, {x: 7, y: 5, z: 0},
    {x: 2, y: 6, z: 0}, {x: 4, y: 6, z: 0}, {x: 6, y: 6, z: 0}, {x: 8, y: 6, z: 0},
    {x: 3, y: 7, z: 0}, {x: 5, y: 7, z: 0}, {x: 7, y: 7, z: 0},
    
    {x: 4, y: 4, z: 1}, {x: 6, y: 4, z: 1}, 
    {x: 5, y: 5, z: 1}, 
    {x: 4, y: 6, z: 1}, {x: 6, y: 6, z: 1},
    
    {x: 3, y: 3, z: 1}, {x: 7, y: 3, z: 1}, 
    {x: 3, y: 7, z: 1}, {x: 7, y: 7, z: 1}
  ]
];

const shuffle = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const SOUNDS = {
  click: new Audio('https://firebasestorage.googleapis.com/v0/b/gamefaktory-1b0b8.firebasestorage.app/o/lulu-happiness%2Ffloraphonic-bloop-1-184019.mp3?alt=media'),
  match: new Audio('https://firebasestorage.googleapis.com/v0/b/gamefaktory-1b0b8.firebasestorage.app/o/lulu-happiness%2Ffloraphonic-marimba-win-b-3-209679.mp3?alt=media'),
  win: new Audio('https://firebasestorage.googleapis.com/v0/b/gamefaktory-1b0b8.firebasestorage.app/o/lulu-happiness%2Fcollectpower.mp3?alt=media'),
  fail: new Audio('https://firebasestorage.googleapis.com/v0/b/gamefaktory-1b0b8.firebasestorage.app/o/lulu-happiness%2Fu_8g40a9z0la-fail-234710.mp3?alt=media')
};

const playSound = (type) => {
  try {
    const s = SOUNDS[type];
    s.currentTime = 0;
    if (type === 'click') s.volume = 0.5;
    s.play().catch(() => {});
  } catch (e) {}
};

export default function GameMatch() {
  const navigate = useNavigate();

  // Initialize sounds outside to avoid recreation, but inside component is fine if we use useMemo, but standard practice for simple apps is outside. Let's define it outside.
  const [tiles, setTiles] = useState([]);
  const [tray, setTray] = useState([]);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'won', 'lost'
  
  const [level, setLevel] = useState(0);
  const [coins, setCoins] = useState(0);
  const [gifts, setGifts] = useState(0);
  const [giftAwarded, setGiftAwarded] = useState(false);
  const [shufflesLeft, setShufflesLeft] = useState(3);
  const [isShuffling, setIsShuffling] = useState(false);
  
  const TILE_SIZE = 60;
  const HALF_SIZE = TILE_SIZE / 2;

  const initGame = (currentLevel = level) => {
    const layout = LEVELS[currentLevel % LEVELS.length];
    let tileTypes = [];
    for (let i = 0; i < layout.length / 3; i++) {
      tileTypes.push(TILE_TYPES[i % TILE_TYPES.length], TILE_TYPES[i % TILE_TYPES.length], TILE_TYPES[i % TILE_TYPES.length]);
    }
    tileTypes = shuffle(tileTypes);

    const newTiles = layout.map((pos, idx) => ({
      id: idx,
      levelId: currentLevel,
      type: tileTypes[idx],
      x: pos.x,
      y: pos.y,
      z: pos.z,
      state: 'board'
    }));
    
    setTiles(newTiles);
    setTray([]);
    setGiftAwarded(false);
    setGameState('playing');
    setShufflesLeft(3);
    setIsShuffling(false);
  };

  const handleShuffleBoard = () => {
    if (shufflesLeft <= 0 || gameState !== 'playing' || isShuffling) return;
    
    playSound('click');
    setShufflesLeft(prev => prev - 1);
    setIsShuffling(true);
    
    setTimeout(() => {
      setTiles(prevTiles => {
        const boardTiles = prevTiles.filter(t => t.state === 'board');
        const trayTiles = prevTiles.filter(t => t.state === 'tray');
        
        let types = boardTiles.map(t => t.type);
        types = shuffle(types);
        
        const newBoardTiles = boardTiles.map((t, i) => ({
          ...t,
          type: types[i]
        }));
        
        return [...newBoardTiles, ...trayTiles];
      });
      setIsShuffling(false);
    }, 300);
  };

  useEffect(() => {
    initGame(level);
  }, [level]);

  const isCovered = (tile) => {
    return tiles.some(t => 
      t.state === 'board' &&
      t.id !== tile.id && 
      t.z > tile.z && 
      Math.abs(t.x - tile.x) < 2 && 
      Math.abs(t.y - tile.y) < 2
    );
  };

  const handleTileClick = (tile) => {
    if (gameState !== 'playing' || tile.state !== 'board' || isCovered(tile)) return;
    if (tray.length >= 7) return;

    playSound('click');

    // Move to tray
    const newTiles = tiles.map(t => t.id === tile.id ? { ...t, state: 'tray' } : t);
    setTiles(newTiles);
    
    let newTray = [...tray, { ...tile, state: 'tray' }];
    
    // Sort tray by type to group identical tiles
    newTray.sort((a, b) => a.type.localeCompare(b.type));
    
    const typeCounts = {};
    newTray.forEach(t => {
      typeCounts[t.type] = (typeCounts[t.type] || 0) + 1;
    });

    let matchedType = null;
    for (const [type, count] of Object.entries(typeCounts)) {
      if (count === 3) {
        matchedType = type;
        break;
      }
    }

    if (matchedType) {
      setTray(newTray);
      setTimeout(() => {
        playSound('match');
        setTray(prevTray => prevTray.filter(t => t.type !== matchedType));
        
        // Rewards Logic
        setCoins(c => c + 1);
        let givesGift = false;
        
        const remainingBoard = newTiles.filter(t => t.state === 'board').length;
        const remainingTray = newTray.length - 3;
        const isLastMatch = remainingBoard === 0 && remainingTray === 0;

        if (!giftAwarded) {
          if (Math.random() > 0.8 || isLastMatch) {
            setGifts(g => g + 1);
            setGiftAwarded(true);
            givesGift = true;
          }
        }

        if (isLastMatch) {
          setTimeout(() => playSound('win'), 200);
          setGameState('won');
        }
      }, 400); // Wait for physical movement before bursting
    } else {
      setTray(newTray);
      if (newTray.length === 7) {
        setTimeout(() => {
          playSound('fail');
          setGameState('lost');
        }, 400);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-between text-gray-800 font-sans z-[100] animate-[fadeIn_0.3s_ease-out] overflow-hidden">
      
      {/* Blurred Background */}
      <div 
        className="absolute inset-0 z-[-1]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.2), rgba(255,255,255,0.2)), url("https://firebasestorage.googleapis.com/v0/b/gamefaktory-1b0b8.firebasestorage.app/o/lulu-happiness%2Flulubg.webp?alt=media")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(2px)',
          transform: 'scale(1.05)' // Prevents the blur from pulling in the edges
        }}
      />
      {/* Top HUD */}
      <div className="w-full p-6 flex justify-between items-start z-20">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white/50 backdrop-blur-md flex items-center justify-center active:scale-95 transition-transform shadow-[0_2px_10px_rgba(0,0,0,0.1)]"
        >
          <X size={24} className="text-gray-800" />
        </button>
        
        <div className="flex flex-col items-end gap-2 pointer-events-none">
          <div className="bg-white/80 backdrop-blur px-5 py-2 rounded-full border border-white shadow-sm font-bold tracking-wider text-[#d35400] flex items-center gap-2">
            LEVEL {level + 1}
          </div>
          
          <div className="flex gap-2">
            <div className="bg-white/60 backdrop-blur px-3 py-1.5 rounded-full border border-white shadow-sm flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-400 border border-yellow-200"></div>
              <span className="font-bold text-gray-700">{coins}</span>
            </div>
            <div className="bg-white/60 backdrop-blur px-3 py-1.5 rounded-full border border-white shadow-sm flex items-center gap-2">
              <span className="text-lg" style={{ lineHeight: 1 }}>🎁</span>
              <span className="font-bold text-gray-700">{gifts}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div className="flex-1 w-full relative max-w-md mx-auto flex items-center justify-center">
        <div 
          className="relative" 
          style={{ 
            width: `${10 * HALF_SIZE}px`, 
            height: `${10 * HALF_SIZE}px` 
          }}
        >
          {tiles.filter(t => t.state === 'board').map(tile => {
            const covered = isCovered(tile);
            return (
              <motion.div
                layoutId={`tile-${tile.levelId}-${tile.id}`}
                layout
                key={`${tile.levelId}-${tile.id}`}
                onClick={() => handleTileClick(tile)}
                className={`absolute rounded-[14px] bg-gradient-to-b from-[#fffefc] to-[#e8e0cc] shadow-[0_4px_0_#b5a48b,0_6px_10px_rgba(0,0,0,0.2)] flex items-center justify-center text-4xl border border-white/50 cursor-pointer ${covered ? 'brightness-[0.7] cursor-not-allowed' : 'hover:brightness-110'}`}
                style={{
                  width: TILE_SIZE,
                  height: TILE_SIZE,
                  left: tile.x * HALF_SIZE - HALF_SIZE,
                  top: tile.y * HALF_SIZE - HALF_SIZE,
                  zIndex: tile.z * 10,
                }}
                animate={isShuffling ? { scale: 0, rotate: 180 } : { scale: 1, rotate: 0 }}
                transition={{ duration: 0.3, type: 'spring', bounce: 0.2 }}
                whileHover={!covered && !isShuffling ? { y: -2 } : {}}
                whileTap={!covered && !isShuffling ? { y: 2, scale: 0.95, boxShadow: '0 0px 0 #b5a48b, 0 2px 5px rgba(0,0,0,0.2)' } : {}}
              >
                {tile.type}
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="w-full flex justify-end px-6 sm:px-10 mb-[-10px] z-10 pointer-events-none">
        <button 
          onClick={handleShuffleBoard}
          disabled={shufflesLeft === 0 || gameState !== 'playing'}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold shadow-lg pointer-events-auto transition-transform active:scale-95 ${shufflesLeft > 0 ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white' : 'bg-gray-400 text-gray-200 cursor-not-allowed'}`}
        >
          <Shuffle size={18} />
          Shuffle ({shufflesLeft})
        </button>
      </div>

      {/* Bottom Tray */}
      <div className="w-full max-w-md mx-auto px-2 sm:px-4 pb-10 pt-4">
        <div className="bg-[#d9975b] rounded-2xl p-2 shadow-[inset_0_4px_10px_rgba(0,0,0,0.3)] flex justify-start gap-1 sm:gap-2 overflow-visible items-center w-fit mx-auto h-[58px] border-2 border-white/30">
          <AnimatePresence>
            {tray.map(tile => (
              <motion.div 
                layoutId={`tile-${tile.levelId}-${tile.id}`}
                layout
                key={`${tile.levelId}-${tile.id}`}
                initial={{ scale: 1 }}
                animate={{ scale: 1 }}
                exit={{ 
                  scale: 1.8, 
                  opacity: 0, 
                  filter: "brightness(200%) blur(4px)",
                  transition: { duration: 0.4, ease: "easeOut" }
                }}
                className="rounded-[10px] bg-gradient-to-b from-[#fffefc] to-[#e8e0cc] shadow-[0_4px_0_#b5a48b] flex items-center justify-center text-2xl border border-white/50 z-50"
                style={{ width: 42, height: 42 }}
              >
                {tile.type}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Empty placeholders directly in the flex flow to guarantee 7 slots width */}
          {Array.from({ length: 7 - tray.length }).map((_, i) => (
            <div key={`empty-${i}`} className="rounded-[10px] bg-black/20 shadow-[inset_0_2px_5px_rgba(0,0,0,0.3)] shrink-0" style={{ width: 42, height: 42 }} />
          ))}
        </div>
      </div>

      {/* Game Over / Win Screens */}
      {gameState !== 'playing' && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-[fadeIn_0.3s]">
          <div className="bg-white rounded-3xl p-8 max-w-[300px] w-full text-center shadow-2xl animate-[bounceIn_0.4s]">
            {gameState === 'won' ? (
              <>
                <Trophy size={60} className="text-yellow-400 mx-auto mb-4" />
                <h2 className="text-3xl font-black text-gray-800 mb-2">LEVEL {level + 1} CLEARED!</h2>
                <p className="text-gray-500 mb-6">You found {coins} Coins and {gifts} Gifts.</p>
                <button 
                  onClick={() => setLevel(l => l + 1)}
                  className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 shadow-[0_4px_0_#047857] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
                >
                  <Play size={20} fill="white" />
                  NEXT LEVEL
                </button>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">💔</div>
                <h2 className="text-3xl font-black text-gray-800 mb-2">TRAY FULL!</h2>
                <p className="text-gray-500 mb-6">No more moves left.</p>
                <button 
                  onClick={() => initGame(level)}
                  className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 shadow-[0_4px_0_#1d4ed8] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw size={20} />
                  TRY AGAIN
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
