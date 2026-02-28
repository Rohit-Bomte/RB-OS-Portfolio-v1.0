import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
    { id: 1, title: 'Lofi Chill - Coding Night', url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3' },
    { id: 2, title: 'Synthwave - Retro Tech', url: 'https://cdn.pixabay.com/download/audio/2022/12/28/audio_651f15321f.mp3?filename=synthwave-80s-133290.mp3' },
    { id: 3, title: 'Chillhop - Data Flow', url: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=lofi-beat-chill-122822.mp3' }
];

export default function MusicPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [volume, setVolume] = useState(0.5);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isClosed, setIsClosed] = useState(false);
    const audioRef = useRef(null);

    const currentTrack = TRACKS[currentTrackIndex];

    if (isClosed) return null;

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(e => {
                    console.error("Audio play failed:", e);
                    setIsPlaying(false);
                });
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentTrackIndex]);

    const handleNext = () => {
        setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
        setIsPlaying(true);
    };

    const handlePrev = () => {
        setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
        setIsPlaying(true);
    };

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const handleVolumeChange = (e) => {
        const val = parseFloat(e.target.value);
        setVolume(val);
        if (audioRef.current) {
            audioRef.current.volume = val;
        }
    };

    return (
        <div style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            width: '260px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--window-shadow)',
            zIndex: 50,
            fontFamily: 'var(--font-mono)',
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* Title bar */}
            <div style={{
                background: 'var(--bg-titlebar)',
                padding: '4px 8px',
                fontSize: '10px',
                color: 'var(--text-primary)',
                borderBottom: '1px solid var(--border-dim)',
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <span>RB-AMP v1.0</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '10px', padding: 0 }}
                        onClick={() => setIsMinimized(!isMinimized)}
                        title="Minimize"
                    >_</button>
                    <button
                        style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'not-allowed', fontSize: '10px', padding: 0, opacity: 0.5 }}
                        title="Maximize"
                    >□</button>
                    <button
                        style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '10px', padding: 0 }}
                        onClick={() => { setIsPlaying(false); setIsClosed(true); }}
                        title="Close"
                    >×</button>
                </div>
            </div>

            {!isMinimized && (
                <div style={{ padding: '12px' }}>
                    {/* Marquee Display */}
                    <div style={{
                        background: 'var(--bg-primary)',
                        border: '1px inset var(--border-dim)',
                        padding: '4px 8px',
                        marginBottom: '12px',
                        height: '24px',
                        overflow: 'hidden',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <div style={{
                            color: 'var(--accent)',
                            fontSize: '11px',
                            whiteSpace: 'nowrap',
                            animation: isPlaying ? 'marquee 10s linear infinite' : 'none',
                            textShadow: 'var(--glow-small)'
                        }}>
                            {isPlaying ? `▶ ${currentTrack.title}` : `⏸ ${currentTrack.title} (Paused)`}
                        </div>
                    </div>

                    {/* Controls */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            <button className="theme-btn" onClick={handlePrev} style={{ padding: '2px 8px', fontSize: '10px' }}>|◀</button>
                            <button className="theme-btn" onClick={togglePlay} style={{ padding: '2px 12px', fontSize: '10px', fontWeight: 'bold' }}>
                                {isPlaying ? '⏸' : '▶'}
                            </button>
                            <button className="theme-btn" onClick={handleNext} style={{ padding: '2px 8px', fontSize: '10px' }}>▶|</button>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>VOL</span>
                            <input
                                type="range"
                                min="0" max="1" step="0.05"
                                value={volume}
                                onChange={handleVolumeChange}
                                style={{ width: '50px', accentColor: 'var(--accent)' }}
                            />
                        </div>
                    </div>
                </div>
            )}

            <audio
                ref={audioRef}
                src={currentTrack.url}
                onEnded={handleNext}
                volume={volume}
            />

            <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
        </div>
    );
}
