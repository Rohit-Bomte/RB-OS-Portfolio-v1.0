import { useState, useCallback } from 'react';

export function useWindowManager() {
    const [windows, setWindows] = useState({});
    const [zCounter, setZCounter] = useState(100);
    const [focusedId, setFocusedId] = useState(null);

    const openWindow = useCallback((id, config) => {
        setWindows(prev => {
            if (prev[id]) {
                // Already open, just focus it
                return {
                    ...prev,
                    [id]: { ...prev[id], minimized: false, zIndex: zCounter + 1 }
                };
            }
            return {
                ...prev,
                [id]: {
                    id,
                    title: config.title,
                    component: config.component,
                    x: config.x || 40 + Object.keys(prev).length * 30,
                    y: config.y || 40 + Object.keys(prev).length * 20,
                    width: config.width || 500,
                    height: config.height || 400,
                    minimized: false,
                    zIndex: zCounter + 1,
                }
            };
        });
        setZCounter(z => z + 1);
        setFocusedId(id);
    }, [zCounter]);

    const closeWindow = useCallback((id) => {
        setWindows(prev => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
        if (focusedId === id) setFocusedId(null);
    }, [focusedId]);

    const minimizeWindow = useCallback((id) => {
        setWindows(prev => ({
            ...prev,
            [id]: { ...prev[id], minimized: true }
        }));
    }, []);

    const focusWindow = useCallback((id) => {
        setWindows(prev => ({
            ...prev,
            [id]: { ...prev[id], minimized: false, zIndex: zCounter + 1 }
        }));
        setZCounter(z => z + 1);
        setFocusedId(id);
    }, [zCounter]);

    const moveWindow = useCallback((id, x, y) => {
        setWindows(prev => ({
            ...prev,
            [id]: { ...prev[id], x, y }
        }));
    }, []);

    return {
        windows,
        focusedId,
        openWindow,
        closeWindow,
        minimizeWindow,
        focusWindow,
        moveWindow,
    };
}
