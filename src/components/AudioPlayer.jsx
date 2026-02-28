import React, { useState, useRef, useEffect } from 'react';

// Selected aesthetic tracks (Served explicitly from the local /public folder to bypass CORS/ORB blocks)
const TRACKS = [
    { id: 1, title: 'Midnight City (Synthwave)', url: '/audio/track1.mp3' },
    { id: 2, title: 'Neon Rain (Cyberpunk)', url: '/audio/track2.mp3' },
    { id: 3, title: 'Coding at 3AM (Lofi Chill)', url: '/audio/track3.mp3' },
    { id: 4, title: 'Data Stream (Chillhop)', url: '/audio/track4.mp3' },
    { id: 5, title: 'Retro Summer (Vaporwave)', url: '/audio/track5.mp3' },
];

export default function AudioPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [volume, setVolume] = useState(0.5);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);

    const currentTrack = TRACKS[currentTrackIndex];

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

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            setDuration(audioRef.current.duration || 0);
        }
    };

    const handleSeek = (e) => {
        const time = parseFloat(e.target.value);
        setCurrentTime(time);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
        }
    };

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%', gap: '20px' }}>

            {/* Player Display Section */}
            <div style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Visualizer bars illusion */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    opacity: isPlaying ? 0.05 : 0,
                    background: 'repeating-linear-gradient(90deg, var(--accent) 0px, var(--accent) 4px, transparent 4px, transparent 8px)',
                    pointerEvents: 'none'
                }}></div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ color: 'var(--text-dim)', fontSize: '10px' }}>NOW PLAYING</div>
                    <div style={{ color: 'var(--accent)', fontSize: '10px' }}>
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                </div>

                <div style={{
                    color: 'var(--highlight)',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    textShadow: 'var(--glow-small)'
                }}>
                    {currentTrack.title}
                </div>

                <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
                />

                {/* Controls */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="theme-btn" onClick={handlePrev} style={{ padding: '6px 14px', fontSize: '12px' }}>|◀</button>
                        <button className="theme-btn" onClick={togglePlay} style={{ padding: '6px 20px', fontSize: '12px', fontWeight: 'bold' }}>
                            {isPlaying ? '⏸ PAUSE' : '▶ PLAY'}
                        </button>
                        <button className="theme-btn" onClick={handleNext} style={{ padding: '6px 14px', fontSize: '12px' }}>▶|</button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>VOL</span>
                        <input
                            type="range"
                            min="0" max="1" step="0.05"
                            value={volume}
                            onChange={handleVolumeChange}
                            style={{ width: '60px', accentColor: 'var(--accent)', cursor: 'pointer' }}
                        />
                    </div>
                </div>
            </div>

            {/* Playlist Section */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Tracklist
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {TRACKS.map((track, idx) => (
                        <div
                            key={track.id}
                            onClick={() => {
                                setCurrentTrackIndex(idx);
                                setIsPlaying(true);
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '10px 12px',
                                cursor: 'pointer',
                                background: currentTrackIndex === idx ? 'var(--icon-hover)' : 'transparent',
                                border: currentTrackIndex === idx ? '1px solid var(--border-dim)' : '1px solid transparent',
                                borderRadius: '4px',
                                color: currentTrackIndex === idx ? 'var(--accent)' : 'var(--text-secondary)'
                            }}
                        >
                            <span style={{ width: '20px', fontSize: '12px', opacity: 0.5 }}>
                                {currentTrackIndex === idx && isPlaying ? '▶' : (idx + 1).toString().padStart(2, '0')}
                            </span>
                            <span style={{ fontSize: '14px' }}>{track.title}</span>
                        </div>
                    ))}
                </div>
            </div>

            <audio
                ref={audioRef}
                src={currentTrack.url}
                preload="none"
                onEnded={handleNext}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleTimeUpdate}
                volume={volume}
            />
        </div>
    );
}
