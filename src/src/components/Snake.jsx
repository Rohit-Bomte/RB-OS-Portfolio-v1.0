import { useState, useEffect, useRef, useCallback } from 'react';

const CELL = 16;
const COLS = 20;
const ROWS = 20;
const TICK = 120;

function randomFood(snake) {
    let pos;
    do {
        pos = {
            x: Math.floor(Math.random() * COLS),
            y: Math.floor(Math.random() * ROWS),
        };
    } while (snake.some(s => s.x === pos.x && s.y === pos.y));
    return pos;
}

export default function Snake() {
    const canvasRef = useRef(null);
    const dirRef = useRef({ x: 1, y: 0 });
    const [gameState, setGameState] = useState('idle'); // idle, playing, over
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(() => {
        return parseInt(localStorage.getItem('rb-snake-highscore') || '0', 10);
    });

    const snakeRef = useRef([{ x: 5, y: 10 }, { x: 4, y: 10 }, { x: 3, y: 10 }]);
    const foodRef = useRef(randomFood(snakeRef.current));
    const scoreRef = useRef(0);

    const draw = useCallback(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;

        const w = COLS * CELL;
        const h = ROWS * CELL;

        // Background
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-primary').trim() || '#0a0e27';
        ctx.fillRect(0, 0, w, h);

        // Grid lines
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-dim').trim() || 'rgba(0,255,65,0.1)';
        ctx.lineWidth = 0.5;
        for (let x = 0; x <= COLS; x++) {
            ctx.beginPath();
            ctx.moveTo(x * CELL, 0);
            ctx.lineTo(x * CELL, h);
            ctx.stroke();
        }
        for (let y = 0; y <= ROWS; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * CELL);
            ctx.lineTo(w, y * CELL);
            ctx.stroke();
        }

        // Food
        const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#00ff41';
        ctx.fillStyle = '#ff4444';
        ctx.shadowColor = '#ff4444';
        ctx.shadowBlur = 6;
        ctx.fillRect(foodRef.current.x * CELL + 2, foodRef.current.y * CELL + 2, CELL - 4, CELL - 4);
        ctx.shadowBlur = 0;

        // Snake
        snakeRef.current.forEach((seg, i) => {
            ctx.fillStyle = i === 0 ? accent : (accent + 'cc');
            ctx.shadowColor = accent;
            ctx.shadowBlur = i === 0 ? 8 : 3;
            ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
        });
        ctx.shadowBlur = 0;
    }, []);

    const tick = useCallback(() => {
        const snake = snakeRef.current;
        const dir = dirRef.current;
        const head = {
            x: (snake[0].x + dir.x + COLS) % COLS,
            y: (snake[0].y + dir.y + ROWS) % ROWS,
        };

        // Self collision
        if (snake.some(s => s.x === head.x && s.y === head.y)) {
            setGameState('over');
            if (scoreRef.current > highScore) {
                setHighScore(scoreRef.current);
                localStorage.setItem('rb-snake-highscore', String(scoreRef.current));
            }
            return false;
        }

        const newSnake = [head, ...snake];

        // Eat food?
        if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
            scoreRef.current += 10;
            setScore(scoreRef.current);
            foodRef.current = randomFood(newSnake);
        } else {
            newSnake.pop();
        }

        snakeRef.current = newSnake;
        draw();
        return true;
    }, [draw, highScore]);

    useEffect(() => {
        if (gameState !== 'playing') return;

        const interval = setInterval(() => {
            if (!tick()) clearInterval(interval);
        }, TICK);

        return () => clearInterval(interval);
    }, [gameState, tick]);

    useEffect(() => {
        const handleKey = (e) => {
            if (gameState !== 'playing') return;

            const dir = dirRef.current;
            switch (e.key) {
                case 'ArrowUp': case 'w': case 'W':
                    if (dir.y !== 1) dirRef.current = { x: 0, y: -1 };
                    e.preventDefault();
                    break;
                case 'ArrowDown': case 's': case 'S':
                    if (dir.y !== -1) dirRef.current = { x: 0, y: 1 };
                    e.preventDefault();
                    break;
                case 'ArrowLeft': case 'a': case 'A':
                    if (dir.x !== 1) dirRef.current = { x: -1, y: 0 };
                    e.preventDefault();
                    break;
                case 'ArrowRight': case 'd': case 'D':
                    if (dir.x !== -1) dirRef.current = { x: 1, y: 0 };
                    e.preventDefault();
                    break;
            }
        };

        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [gameState]);

    const startGame = () => {
        snakeRef.current = [{ x: 5, y: 10 }, { x: 4, y: 10 }, { x: 3, y: 10 }];
        foodRef.current = randomFood(snakeRef.current);
        dirRef.current = { x: 1, y: 0 };
        scoreRef.current = 0;
        setScore(0);
        setGameState('playing');
        draw();
    };

    useEffect(() => {
        draw();
    }, [draw]);

    return (
        <div className="snake-game" style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 11, padding: '0 4px' }}>
                <span>🐍 SCORE: <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{score}</span></span>
                <span>🏆 HIGH: <span style={{ color: 'var(--warning)' }}>{highScore}</span></span>
            </div>

            <canvas
                ref={canvasRef}
                width={COLS * CELL}
                height={ROWS * CELL}
                style={{
                    border: '1px solid var(--border)',
                    display: 'block',
                    margin: '0 auto',
                    imageRendering: 'pixelated',
                }}
            />

            {gameState === 'idle' && (
                <button className="snake-start-btn" onClick={startGame}>
                    ▶ START GAME
                </button>
            )}

            {gameState === 'over' && (
                <div style={{ marginTop: 12 }}>
                    <div style={{ color: 'var(--error)', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                        GAME OVER — Score: {score}
                    </div>
                    <button className="snake-start-btn" onClick={startGame}>
                        ↻ PLAY AGAIN
                    </button>
                </div>
            )}

            <div style={{
                marginTop: 10,
                fontSize: 9,
                color: 'var(--text-dim)',
                lineHeight: 1.8,
            }}>
                Arrow keys or WASD to move
            </div>
        </div>
    );
}
