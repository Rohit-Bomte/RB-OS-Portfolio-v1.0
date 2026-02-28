import { useState } from 'react';
import { clippyTips } from '../data/profileData';

export default function Clippy({ onClose }) {
    const [tipIndex, setTipIndex] = useState(0);

    const nextTip = () => {
        setTipIndex((prev) => (prev + 1) % clippyTips.length);
    };

    return (
        <div className="clippy fade-in">
            <div className="clippy-titlebar">
                <span className="clippy-title">Clippy</span>
                <div className="window-controls">
                    <button className="window-btn" onClick={onClose} style={{ width: 16, height: 16, fontSize: 9 }}>_</button>
                    <button className="window-btn close" onClick={onClose} style={{ width: 16, height: 16, fontSize: 9 }}>×</button>
                </div>
            </div>
            <div className="clippy-body">
                <span className="clippy-icon">📎</span>
                <span className="clippy-text">{clippyTips[tipIndex]}</span>
            </div>
            <div className="clippy-actions">
                <button className="clippy-btn primary" onClick={nextTip}>Next Tip</button>
                <button className="clippy-btn" onClick={onClose}>Go Away</button>
            </div>
        </div>
    );
}
