import { useEffect, useRef, useState } from 'react';
import { skillRadar } from '../data/profileData';

export default function Radar() {
    const canvasRef = useRef(null);
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const size = 280;
        const cx = size / 2;
        const cy = size / 2;
        const maxR = 100;
        canvas.width = size;
        canvas.height = size;

        const entries = Object.entries(skillRadar);
        const n = entries.length;
        const angleStep = (Math.PI * 2) / n;

        const style = getComputedStyle(document.documentElement);
        const accent = style.getPropertyValue('--accent').trim() || '#00ff41';
        const dim = style.getPropertyValue('--text-dim').trim() || '#007722';
        const bg = style.getPropertyValue('--bg-primary').trim() || '#0a0e27';

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, size, size);

        // Draw grid rings
        for (let r = 20; r <= maxR; r += 20) {
            ctx.beginPath();
            for (let i = 0; i <= n; i++) {
                const angle = i * angleStep - Math.PI / 2;
                const px = cx + Math.cos(angle) * r;
                const py = cy + Math.sin(angle) * r;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.strokeStyle = dim + '44';
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }

        // Draw axes
        for (let i = 0; i < n; i++) {
            const angle = i * angleStep - Math.PI / 2;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR);
            ctx.strokeStyle = dim + '66';
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }

        // Draw data polygon
        ctx.beginPath();
        entries.forEach(([, value], i) => {
            const angle = i * angleStep - Math.PI / 2;
            const r = (value / 100) * maxR;
            const px = cx + Math.cos(angle) * r;
            const py = cy + Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        });
        ctx.closePath();
        ctx.fillStyle = accent + '22';
        ctx.fill();
        ctx.strokeStyle = accent;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Draw data points
        entries.forEach(([, value], i) => {
            const angle = i * angleStep - Math.PI / 2;
            const r = (value / 100) * maxR;
            const px = cx + Math.cos(angle) * r;
            const py = cy + Math.sin(angle) * r;
            ctx.beginPath();
            ctx.arc(px, py, 3, 0, Math.PI * 2);
            ctx.fillStyle = accent;
            ctx.fill();
        });

        // Draw labels
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillStyle = dim;
        entries.forEach(([label], i) => {
            const angle = i * angleStep - Math.PI / 2;
            const lr = maxR + 18;
            const px = cx + Math.cos(angle) * lr;
            const py = cy + Math.sin(angle) * lr;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, px, py);
        });

        setTimeout(() => setAnimated(true), 100);
    }, []);

    return (
        <div className="radar-container">
            <div style={{ color: 'var(--accent)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', alignSelf: 'flex-start' }}>
                📊 Skills Radar
            </div>
            <canvas ref={canvasRef} className="radar-canvas" />
            <div className="radar-bars">
                {Object.entries(skillRadar).map(([label, value]) => (
                    <div key={label} className="radar-bar-item">
                        <span className="radar-bar-label">{label}</span>
                        <div className="radar-bar-track">
                            <div
                                className="radar-bar-fill"
                                style={{ width: animated ? `${value}%` : '0%' }}
                            />
                        </div>
                        <span className="radar-bar-value">{value}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
