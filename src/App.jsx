import { useState, useEffect, useMemo } from 'react';
import { useWindowManager } from './hooks/useWindowManager';
import BootScreen from './components/BootScreen';
import Window from './components/Window';
import Terminal from './components/Terminal';
import About from './components/About';
import Skills from './components/Skills';
import Radar from './components/Radar';
import Projects from './components/Projects';
import Timeline from './components/Timeline';
import Awards from './components/Awards';
import DisplaySettings from './components/DisplaySettings';
import Clippy from './components/Clippy';
import Tetris from './components/Tetris';
import Snake from './components/Snake';
import CodePlayground from './components/CodePlayground';
import FileManager from './components/FileManager';
import Resume from './components/Resume';
import Logs from './components/Logs';
import AudioPlayer from './components/AudioPlayer';
import { profile } from './data/profileData';

const DESKTOP_ICONS = [
  { id: 'terminal', icon: '>_', label: 'Terminal', title: 'TERMINAL_V1.0.EXE', width: 650, height: 450 },
  { id: 'files', icon: '📂', label: 'Files', title: 'FILE_MANAGER.EXE', width: 500, height: 420 },
  { id: 'projects', icon: '📁', label: 'Projects', title: 'PROJECTS/CASE_STUDIES', width: 600, height: 480 },
  { id: 'logs', icon: '📋', label: 'Logs', title: 'SYSTEM_LOGS.TXT', width: 550, height: 460 },
  { id: 'about', icon: '👤', label: 'About', title: 'ABOUT_ME.INFO', width: 480, height: 520 },
  { id: 'skills', icon: '⚙️', label: 'Skills', title: 'TECH_STACK.CFG', width: 460, height: 500 },
  { id: 'radar', icon: '📊', label: 'Radar', title: 'SKILLS_RADAR.EXE', width: 400, height: 550 },
  { id: 'awards', icon: '🏆', label: 'Awards', title: 'ACHIEVEMENTS.EXE', width: 440, height: 480 },
  { id: 'resume', icon: '📄', label: 'Resume', title: 'RESUME.EXE', width: 520, height: 550 },
  { id: 'code', icon: '💻', label: 'Code', title: 'CODE_PLAYGROUND.PY', width: 520, height: 450 },
  { id: 'display', icon: '🖥️', label: 'Display', title: 'DISPLAY_SETTINGS.CFG', width: 420, height: 480 },
  { id: 'audio', icon: '🎵', label: 'Audio', title: 'AUDIO_PLAYER.EXE', width: 400, height: 500 },
  { id: 'tetris', icon: '🧱', label: 'Tetris', title: 'TETRIS.EXE', width: 380, height: 520 },
  { id: 'snake', icon: '🐍', label: 'Snake', title: 'SNAKE.EXE', width: 370, height: 470 },
  { id: 'timeline', icon: '📅', label: 'Timeline', title: 'CAREER_TIMELINE.EXE', width: 420, height: 450 },
];

function Starfield() {
  const stars = useMemo(() => (
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      duration: Math.random() * 3 + 2,
    }))
  ), []);

  return (
    <div className="wallpaper-starfield">
      {stars.map(s => (
        <div
          key={s.id}
          className="star"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            '--duration': `${s.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

function MatrixRain() {
  const columns = useMemo(() => (
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: (i / 30) * 100,
      chars: Array.from({ length: 20 }, () =>
        String.fromCharCode(0x30A0 + Math.random() * 96)
      ).join(''),
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 5,
    }))
  ), []);

  return (
    <div className="wallpaper-matrix">
      {columns.map(col => (
        <div
          key={col.id}
          className="matrix-column"
          style={{
            left: `${col.left}%`,
            '--duration': `${col.duration}s`,
            '--delay': `${col.delay}s`,
          }}
        >
          {col.chars}
        </div>
      ))}
    </div>
  );
}

function RetroGrid() {
  return <div className="wallpaper-retrogrid" />;
}

function Clock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <span className="taskbar-clock">
      {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </span>
  );
}

let globalAudioCtx = null;
const playClickSound = () => {
  try {
    if (!globalAudioCtx) {
      globalAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (globalAudioCtx.state === 'suspended') {
      globalAudioCtx.resume();
    }
    const osc = globalAudioCtx.createOscillator();
    const gain = globalAudioCtx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, globalAudioCtx.currentTime);
    gain.gain.setValueAtTime(0.015, globalAudioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, globalAudioCtx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(globalAudioCtx.destination);
    osc.start();
    osc.stop(globalAudioCtx.currentTime + 0.05);
  } catch (e) { console.error("Audio error: ", e); }
};

export default function App() {
  const [booted, setBooted] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('rb-theme') || 'green');
  const [wallpaper, setWallpaper] = useState(() => localStorage.getItem('rb-wallpaper') || 'matrix');
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [showClippy, setShowClippy] = useState(true);
  const [visitorCount] = useState(() => {
    const stored = parseInt(localStorage.getItem('rb-visitors') || '0', 10);
    const newCount = stored + 1;
    localStorage.setItem('rb-visitors', String(newCount));
    return 2300 + newCount;
  });

  const wm = useWindowManager();

  // Global click sound
  useEffect(() => {
    if (!booted) return;
    window.addEventListener('mousedown', playClickSound);
    return () => window.removeEventListener('mousedown', playClickSound);
  }, [booted]);

  // Apply theme
  useEffect(() => {
    if (theme === 'green') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
    localStorage.setItem('rb-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('rb-wallpaper', wallpaper);
  }, [wallpaper]);

  // Show clippy after 3s
  useEffect(() => {
    if (booted) {
      const timer = setTimeout(() => setShowClippy(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [booted]);

  // Konami Code Easter Egg
  useEffect(() => {
    if (!booted) return;
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    const handleKeyDown = (e) => {
      // Ignore if typing in terminal
      if (document.activeElement.tagName === 'INPUT') return;

      if (e.key.toLowerCase() === konamiCode[konamiIndex].toLowerCase() || e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          // Trigger Easter Egg!
          setTheme('matrix');
          setWallpaper('matrix');
          openWindowById('terminal');

          // Play Hacker Alarm Sound
          try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, audioCtx.currentTime);
            osc.frequency.linearRampToValueAtTime(300, audioCtx.currentTime + 0.2);
            osc.frequency.linearRampToValueAtTime(150, audioCtx.currentTime + 0.4);
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.5);
          } catch (err) { }

          // Wait a tick for terminal to open, then push secret command
          setTimeout(() => {
            const termEvent = new CustomEvent('rb-terminal-cmd', { detail: 'echo -e "\\n\\n[!] HIDDEN ACCESS GRANTED\\n[!] OVERRIDING MAINFRAME ENCRYPTION...\\n[!] WELCOME, ADMIN.\\n"' });
            window.dispatchEvent(termEvent);
          }, 500);

          konamiIndex = 0; // Reset
        }
      } else {
        konamiIndex = 0; // Reset on wrong key
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [booted]);

  const handleIconClick = (iconConfig) => {
    wm.openWindow(iconConfig.id, {
      title: iconConfig.title,
      width: iconConfig.width,
      height: iconConfig.height,
    });
    setShowStartMenu(false);
  };

  const openWindowById = (id) => {
    const icon = DESKTOP_ICONS.find(i => i.id === id);
    if (icon) handleIconClick(icon);
  };

  const renderWindowContent = (id) => {
    switch (id) {
      case 'terminal': return <Terminal openWindow={openWindowById} />;
      case 'about': return <About />;
      case 'skills': return <Skills />;
      case 'radar': return <Radar />;
      case 'projects': return <Projects />;
      case 'timeline': return <Timeline />;
      case 'awards': return <Awards />;
      case 'display': return (
        <DisplaySettings
          theme={theme}
          setTheme={setTheme}
          wallpaper={wallpaper}
          setWallpaper={setWallpaper}
        />
      );
      case 'audio': return <AudioPlayer />;
      case 'tetris': return <Tetris />;
      case 'snake': return <Snake />;
      case 'code': return <CodePlayground />;
      case 'files': return <FileManager />;
      case 'resume': return <Resume />;
      case 'logs': return <Logs />;
      default: return null;
    }
  };

  const openTetris = () => {
    setBooted(true);
    setTimeout(() => openWindowById('tetris'), 100);
  };

  const handleBootComplete = (mode) => {
    setBooted(true);
    if (mode === 'explore') {
      setTimeout(() => openWindowById('terminal'), 100);
    }
  };

  if (!booted) {
    return <BootScreen onComplete={handleBootComplete} onPlayTetris={openTetris} />;
  }

  return (
    <>
      <div className="crt-overlay" />

      <div className="desktop" onClick={() => setShowStartMenu(false)}>
        {/* Wallpaper */}
        {wallpaper === 'starfield' && <Starfield />}
        {wallpaper === 'matrix' && <MatrixRain />}
        {wallpaper === 'retrogrid' && <RetroGrid />}

        {/* Top bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '6px 12px', zIndex: 10
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
            <span className="status-dot"></span>
            <span style={{ color: 'var(--accent)' }}>Available for opportunities</span>
          </span>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '3px 10px',
              border: '1px solid var(--border-dim)',
              color: 'var(--highlight)',
              textDecoration: 'none',
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
            }}
          >
            🔗 LinkedIn
          </a>
        </div>

        {/* Desktop Icons */}
        <div className="desktop-icons">
          {DESKTOP_ICONS.map(icon => (
            <div
              key={icon.id}
              className="desktop-icon"
              onClick={(e) => { e.stopPropagation(); handleIconClick(icon); }}
            >
              <span className="desktop-icon-img">
                {icon.id === 'terminal' ? (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', color: 'var(--accent)' }}>{icon.icon}</span>
                ) : icon.icon}
              </span>
              <span className="desktop-icon-label">{icon.label}</span>
            </div>
          ))}
        </div>

        {/* Windows */}
        {Object.values(wm.windows).map(win => (
          !win.minimized && (
            <Window
              key={win.id}
              id={win.id}
              title={win.title}
              x={win.x}
              y={win.y}
              width={win.width}
              height={win.height}
              zIndex={win.zIndex}
              focused={wm.focusedId === win.id}
              onClose={wm.closeWindow}
              onMinimize={wm.minimizeWindow}
              onFocus={wm.focusWindow}
              onMove={wm.moveWindow}
            >
              {renderWindowContent(win.id)}
            </Window>
          )
        ))}

        {/* Clippy */}
        {showClippy && <Clippy onClose={() => setShowClippy(false)} />}

      </div>

      {/* Start Menu */}
      {showStartMenu && (
        <div className="start-menu fade-in" onClick={e => e.stopPropagation()}>
          <div className="start-menu-header">
            <span className="start-menu-avatar">👨‍💻</span>
            <div>
              <div className="start-menu-name">{profile.name}</div>
              <div className="start-menu-role">Data Engineer</div>
            </div>
          </div>
          <div className="start-menu-items">
            {DESKTOP_ICONS.map(icon => (
              <button
                key={icon.id}
                className="start-menu-item"
                onClick={() => handleIconClick(icon)}
              >
                <span>{icon.id === 'terminal' ? '>_' : icon.icon}</span>
                <span>{icon.label}</span>
              </button>
            ))}
            <div className="start-menu-divider" />
            <button className="start-menu-item" onClick={() => {
              setShowStartMenu(false);
              window.open(profile.links.linkedin, '_blank');
            }}>
              <span>🔗</span>
              <span>LinkedIn</span>
            </button>
            <button className="start-menu-item" onClick={() => {
              setShowStartMenu(false);
              window.open(profile.links.github, '_blank');
            }}>
              <span>🐙</span>
              <span>GitHub</span>
            </button>
          </div>
        </div>
      )}

      {/* Taskbar */}
      <div className="taskbar">
        <button
          className="start-btn"
          onClick={(e) => { e.stopPropagation(); setShowStartMenu(s => !s); }}
        >
          ☰ START
        </button>

        <div className="taskbar-windows">
          {Object.values(wm.windows).map(win => (
            <button
              key={win.id}
              className={`taskbar-tab ${wm.focusedId === win.id && !win.minimized ? 'active' : ''}`}
              onClick={() => wm.focusWindow(win.id)}
            >
              {DESKTOP_ICONS.find(i => i.id === win.id)?.label?.toUpperCase() || win.id.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="taskbar-tray">
          <span
            className="taskbar-tray-item"
            onClick={() => setShowClippy(s => !s)}
            title="Toggle Clippy"
          >
            📎
          </span>
          <span className="taskbar-tray-item visitor-count" title="Visitor count">
            👤 {visitorCount}
          </span>
          <Clock />
        </div>
      </div>
    </>
  );
}
