export default function DisplaySettings({ theme, setTheme, wallpaper, setWallpaper }) {
    const themes = ['green', 'amber', 'cyan', 'matrix', 'cyberpunk', 'synthwave'];

    const wallpaperOptions = [
        { id: 'matrix', label: 'Matrix Rain', icon: '🟢' },
        { id: 'starfield', label: 'Starfield', icon: '✨' },
        { id: 'retrogrid', label: 'Retro Grid', icon: '📐' },
        { id: 'none', label: 'None', icon: '🚫' },
    ];

    const bootMode = localStorage.getItem('rb-boot-mode') || 'full';

    const toggleBootMode = () => {
        const next = bootMode === 'full' ? 'skip' : 'full';
        localStorage.setItem('rb-boot-mode', next);
    };

    return (
        <div>
            <div style={{ color: 'var(--accent)', fontSize: '11px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '2px' }}>
                🖥 Display Settings
            </div>

            <div className="settings-section">
                <h4>—— THEME ——</h4>
                <div className="theme-options">
                    {themes.map(t => (
                        <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                            <input
                                type="radio"
                                name="theme"
                                checked={theme === t}
                                onChange={() => setTheme(t)}
                                style={{ accentColor: 'var(--accent)' }}
                            />
                            <span style={{ fontSize: 11, color: theme === t ? 'var(--accent)' : 'var(--text-secondary)' }}>
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="settings-section">
                <h4>—— WALLPAPER ——</h4>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 8,
                }}>
                    {wallpaperOptions.map(w => (
                        <button
                            key={w.id}
                            className={`theme-btn ${wallpaper === w.id ? 'active' : ''}`}
                            onClick={() => setWallpaper(w.id)}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 4,
                                padding: '10px 8px',
                            }}
                        >
                            <span style={{ fontSize: 20 }}>{w.icon}</span>
                            <span style={{ fontSize: 9 }}>{w.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="settings-section">
                <h4>—— BOOT MODE ——</h4>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>Current: <strong style={{ color: 'var(--accent)' }}>{bootMode}</strong></span>
                    <button
                        className="theme-btn"
                        onClick={toggleBootMode}
                        style={{ padding: '4px 10px', fontSize: 10 }}
                    >
                        RESET
                    </button>
                </div>
            </div>

            <div className="settings-section" style={{ borderTop: '1px solid var(--border-dim)', paddingTop: 12 }}>
                <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
                    All preferences saved to localStorage.
                </div>
            </div>
        </div>
    );
}
