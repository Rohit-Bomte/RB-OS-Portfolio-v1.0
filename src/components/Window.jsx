import { useState, useRef, useCallback, useEffect } from 'react';

export default function Window({ id, title, x, y, width, height, zIndex, focused, onClose, onMinimize, onFocus, onMove, children }) {
    const [dragging, setDragging] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const windowRef = useRef(null);

    const handleMouseDown = useCallback((e) => {
        if (e.target.closest('.window-btn')) return;
        onFocus(id);
        setDragging(true);
        dragOffset.current = {
            x: e.clientX - x,
            y: e.clientY - y,
        };
        e.preventDefault();
    }, [id, x, y, onFocus]);

    useEffect(() => {
        if (!dragging) return;

        const handleMouseMove = (e) => {
            const newX = Math.max(0, Math.min(e.clientX - dragOffset.current.x, window.innerWidth - 100));
            const newY = Math.max(0, Math.min(e.clientY - dragOffset.current.y, window.innerHeight - 100));
            onMove(id, newX, newY);
        };

        const handleMouseUp = () => setDragging(false);

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging, id, onMove]);

    return (
        <div
            ref={windowRef}
            className={`window fade-in ${focused ? 'focused' : ''}`}
            style={{ left: x, top: y, width, height, zIndex }}
            onMouseDown={() => onFocus(id)}
        >
            <div className="window-titlebar" onMouseDown={handleMouseDown}>
                <span className="window-title">{title}</span>
                <div className="window-controls">
                    <button className="window-btn" onClick={() => onMinimize(id)} title="Minimize">_</button>
                    <button className="window-btn close" onClick={() => onClose(id)} title="Close">×</button>
                </div>
            </div>
            <div className="window-content">
                {children}
            </div>
        </div>
    );
}
