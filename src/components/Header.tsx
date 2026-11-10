import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Calendar, 
  Moon, 
  Sun, 
  Maximize2, 
  Minimize2, 
  UploadCloud, 
  FileDown, 
  Volume2, 
  VolumeX, 
  User as UserIcon,
  ShieldCheck,
  LogOut,
  LogIn,
  Music
} from 'lucide-react';
import { soundEffects } from '../utils/audio';
import { logOut, signInWithGoogle } from '../lib/firebase';
import { User } from 'firebase/auth';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  currentUser: User | null;
  userEmail: string;
  onOpenUpload: () => void;
  onOpenPdfModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  currentUser,
  userEmail,
  onOpenUpload,
  onOpenPdfModal,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(soundEffects.getMuted());
  const [soundPlaying, setSoundPlaying] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
      setCurrentDate(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = () => {
    soundEffects.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const toggleTheme = () => {
    soundEffects.playClick();
    const nextMode = !darkMode;
    setDarkMode(nextMode);
  };

  const handleToggleMute = () => {
    const next = soundEffects.toggleMute();
    setIsMuted(next);
  };

  const handleTestMusic = () => {
    setSoundPlaying(true);
    soundEffects.playVictoryChime();
    setTimeout(() => setSoundPlaying(false), 1000);
  };

  const handleAuthAction = async () => {
    soundEffects.playClick();
    if (currentUser) {
      if (window.confirm('Are you sure you want to log out?')) {
        await logOut();
      }
    } else {
      await signInWithGoogle();
    }
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 text-white font-black text-sm tracking-wider">
              TBC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                  TBC analysis
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  Live Analytics
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Enterprise Sales &amp; Brand Intelligence Platform
              </p>
            </div>
          </div>

          {/* Center: Live Clock & Calendar */}
          <div className="hidden md:flex items-center gap-4 px-4 py-2 rounded-2xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs shadow-inner">
            <div className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              <span>{currentDate}</span>
            </div>
            <div className="w-px h-3.5 bg-slate-300 dark:bg-slate-700" />
            <div className="flex items-center gap-1.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{currentTime}</span>
            </div>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Play Sound Chime Button */}
            <button
              onClick={handleTestMusic}
              className={`p-2 rounded-xl border transition-all ${
                soundPlaying 
                  ? 'bg-amber-100 border-amber-300 text-amber-600 dark:bg-amber-950 dark:text-amber-400 scale-105' 
                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
              title="Play Music Chime"
            >
              <Music className="w-4 h-4" />
            </button>

            {/* Sound Mute/Unmute Toggle */}
            <button
              onClick={handleToggleMute}
              className={`p-2 rounded-xl border transition-colors ${
                isMuted
                  ? 'border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  : 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
              }`}
              title={isMuted ? 'Sound Muted' : 'Sound Active (Plays victory chime on upload)'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hidden sm:flex transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Upload Excel Button */}
            <button
              onClick={() => {
                soundEffects.playClick();
                onOpenUpload();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 transition-all active:scale-95"
            >
              <UploadCloud className="w-4 h-4" />
              <span className="hidden sm:inline">Upload Excel</span>
            </button>

            {/* Download PDF Button */}
            <button
              onClick={() => {
                soundEffects.playClick();
                onOpenPdfModal();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-500/20 transition-all active:scale-95"
            >
              <FileDown className="w-4 h-4" />
              <span className="hidden sm:inline">PDF Report</span>
            </button>

            {/* User Attribution & Logout Button (Requirement 4) */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
              <div className="hidden lg:block text-left text-xs">
                <div className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200">
                  <span className="truncate max-w-[130px]">{userEmail}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                </div>
                <span className="text-[10px] text-slate-400">Reporter</span>
              </div>

              {/* Logout / Login Button */}
              <button
                onClick={handleAuthAction}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-rose-50 hover:border-rose-300 dark:hover:bg-rose-950/40 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-semibold transition-colors"
                title={currentUser ? 'Log out of account' : 'Log in with Google'}
              >
                {currentUser ? (
                  <>
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    <span className="hidden xl:inline">Logout</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="hidden xl:inline">Login</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
