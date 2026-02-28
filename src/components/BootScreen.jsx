import { useState, useEffect, useRef } from 'react';

const bootSequence = [
    { text: "BIOS v3.14 — Rohit Bomte Systems Inc.", delay: 200 },
    { text: "Checking RAM.......... 640KB OK", delay: 400 },
    { text: "Detecting drives......", delay: 300 },
    { text: "  C:\\ — 500GB SSD [HEALTHY]", delay: 200 },
    { text: "  D:\\ — Portfolio Archive [MOUNTED]", delay: 200 },
    { text: "", delay: 100 },
    { text: "Loading RB-OS Kernel............", delay: 600 },
    { text: "Initializing network interfaces... OK", delay: 300 },
    { text: "Starting display driver... CRT_MODE ACTIVE", delay: 300 },
    { text: "Loading modules: [Python] [SQL] [Airflow] [Power BI]", delay: 400 },
    { text: "Loading data subsystems: [ETL] [Playwright] [ClickHouse]", delay: 400 },
    { text: "", delay: 100 },
    { text: "╔══════════════════════════════════════════╗", delay: 100 },
    { text: "║   RB-OS v1.0 — All Systems Operational   ║", delay: 100 },
    { text: "╚══════════════════════════════════════════╝", delay: 100 },
    { text: "", delay: 100 },
    { text: "Launching desktop environment...", delay: 800 },
];

const ASCII_LOGO = `
 ____   ___  _   _ ___ _____ 
|  _ \\ / _ \\| | | |_ _|_   _|
| |_) | | | | |_| || |  | |  
|  _ <| |_| |  _  || |  | |  
|_| \\_\\\\___/|_| |_|___| |_|  
`;

// Web Audio API sound generator
const playSound = (freq, duration, type = "square", volume = 0.1) => {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(volume, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
        // Audio not supported, fail silently
    }
};

const playStartupChime = () => {
    // C4, E4, G4, C5 — classic startup chime
    [262, 330, 392, 523].forEach((freq, i) =>
        setTimeout(() => playSound(freq, 0.3, "square", 0.08), i * 150)
    );
};

const playBootBeep = () => {
    playSound(800, 0.05, "square", 0.05);
};

export default function BootScreen({ onComplete, onPlayTetris }) {
    const [lines, setLines] = useState([]);
    const [progress, setProgress] = useState(0);
    const [phase, setPhase] = useState('boot'); // 'boot' | 'welcome'
    const [fadeOut, setFadeOut] = useState(false);
    const bootRef = useRef(null);
    const hasStarted = useRef(false);

    useEffect(() => {
        if (hasStarted.current) return;
        hasStarted.current = true;

        let currentLine = 0;
        const totalLines = bootSequence.length;

        const addLine = () => {
            if (currentLine >= totalLines) {
                // Boot complete — play startup chime and transition to welcome
                setTimeout(() => {
                    playStartupChime();
                    setPhase('welcome');
                }, 500);
                return;
            }

            const entry = bootSequence[currentLine];
            setLines(prev => [...prev, entry.text]);
            setProgress(Math.round(((currentLine + 1) / totalLines) * 100));

            // Play a small beep for non-empty lines
            if (entry.text && !entry.text.startsWith('╔') && !entry.text.startsWith('║') && !entry.text.startsWith('╚')) {
                playBootBeep();
            }

            currentLine++;
            setTimeout(addLine, entry.delay);
        };

        // Small initial delay before starting
        setTimeout(addLine, 300);
    }, []);

    // Auto-scroll boot text to bottom
    useEffect(() => {
        if (bootRef.current) {
            bootRef.current.scrollTop = bootRef.current.scrollHeight;
        }
    }, [lines]);

    const handleExplore = () => {
        playSound(400, 0.1, "square", 0.06);
        setTimeout(() => playSound(600, 0.1, "square", 0.06), 80);
        setFadeOut(true);
        setTimeout(() => onComplete('explore'), 600);
    };

    const handleTetris = () => {
        playSound(400, 0.1, "square", 0.06);
        setTimeout(() => playSound(600, 0.1, "square", 0.06), 80);
        setFadeOut(true);
        setTimeout(() => {
            if (onPlayTetris) onPlayTetris();
        }, 600);
    };

    return (
        <div className={`boot-screen ${fadeOut ? 'boot-fadeout' : ''}`}>
            <div className="crt-overlay"></div>

            {phase === 'boot' && (
                <div className="boot-content">
                    <div className="boot-text" ref={bootRef}>
                        {lines.map((line, i) => (
                            <div key={i} className={`boot-line ${line.startsWith('╔') || line.startsWith('║') || line.startsWith('╚')
                                ? 'boot-line-box'
                                : line.includes('OK') || line.includes('HEALTHY') || line.includes('MOUNTED') || line.includes('ACTIVE')
                                    ? 'boot-line-success'
                                    : ''
                                }`}>
                                {line || '\u00A0'}
                            </div>
                        ))}
                    </div>
                    <div className="boot-progress-container">
                        <div className="boot-progress-bar">
                            <div
                                className="boot-progress-fill"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <div className="boot-progress-text">LOADING... {progress}%</div>
                    </div>
                </div>
            )}

            {phase === 'welcome' && (
                <div className="welcome-screen">
                    <pre className="welcome-ascii">{ASCII_LOGO}</pre>
                    <div className="welcome-title">Welcome to RB-OS v1.0</div>
                    <div className="welcome-subtitle">
                        Data Engineering & Analytics Intern • Delphi Analytics • GHRCE Nagpur
                    </div>
                    <div className="welcome-buttons">
                        <button className="welcome-btn welcome-btn-primary" onClick={handleExplore}>
                            ▶ EXPLORE PORTFOLIO
                        </button>
                        <button className="welcome-btn welcome-btn-secondary" onClick={handleTetris}>
                            🎮 PLAY TETRIS
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
