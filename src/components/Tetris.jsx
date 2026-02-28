import { useState, useEffect, useCallback, useRef } from 'react';

const COLS = 10;
const ROWS = 20;
const TICK_MS = 500;

const PIECES = [
    { shape: [[1, 1, 1, 1]], color: '#00e5ff' },           // I
    { shape: [[1, 1], [1, 1]], color: '#ffaa00' },          // O
    { shape: [[0, 1, 0], [1, 1, 1]], color: '#aa44ff' },      // T
    { shape: [[1, 0], [1, 0], [1, 1]], color: '#ff6622' },    // L
    { shape: [[0, 1], [0, 1], [1, 1]], color: '#4488ff' },    // J
    { shape: [[0, 1, 1], [1, 1, 0]], color: '#00ff41' },      // S
    { shape: [[1, 1, 0], [0, 1, 1]], color: '#ff4444' },      // Z
];

function createBoard() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

function randomPiece() {
    const p = PIECES[Math.floor(Math.random() * PIECES.length)];
    return {
        shape: p.shape.map(r => [...r]),
        color: p.color,
        x: Math.floor(COLS / 2) - Math.floor(p.shape[0].length / 2),
        y: 0,
    };
}

function rotate(shape) {
    const rows = shape.length;
    const cols = shape[0].length;
    const rotated = [];
    for (let c = 0; c < cols; c++) {
        const newRow = [];
        for (let r = rows - 1; r >= 0; r--) {
            newRow.push(shape[r][c]);
        }
        rotated.push(newRow);
    }
    return rotated;
}

function collides(board, piece, dx = 0, dy = 0, shape = null) {
    const s = shape || piece.shape;
    for (let r = 0; r < s.length; r++) {
        for (let c = 0; c < s[r].length; c++) {
            if (!s[r][c]) continue;
            const nx = piece.x + c + dx;
            const ny = piece.y + r + dy;
            if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
            if (ny >= 0 && board[ny][nx]) return true;
        }
    }
    return false;
}

function merge(board, piece) {
    const newBoard = board.map(r => [...r]);
    for (let r = 0; r < piece.shape.length; r++) {
        for (let c = 0; c < piece.shape[r].length; c++) {
            if (piece.shape[r][c] && piece.y + r >= 0) {
                newBoard[piece.y + r][piece.x + c] = piece.color;
            }
        }
    }
    return newBoard;
}

function clearLines(board) {
    let cleared = 0;
    const newBoard = board.filter(row => {
        if (row.every(cell => cell !== 0)) {
            cleared++;
            return false;
        }
        return true;
    });
    while (newBoard.length < ROWS) {
        newBoard.unshift(Array(COLS).fill(0));
    }
    return { board: newBoard, cleared };
}

export default function Tetris() {
    const [board, setBoard] = useState(createBoard);
    const [piece, setPiece] = useState(randomPiece);
    const [nextPiece, setNextPiece] = useState(randomPiece);
    const [score, setScore] = useState(0);
    const [lines, setLines] = useState(0);
    const [level, setLevel] = useState(1);
    const [gameOver, setGameOver] = useState(false);
    const [paused, setPaused] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const gameRef = useRef(null);

    const tick = useCallback(() => {
        if (gameOver || paused || !gameStarted) return;

        if (!collides(board, piece, 0, 1)) {
            setPiece(p => ({ ...p, y: p.y + 1 }));
        } else {
            // Merge piece
            const merged = merge(board, piece);
            const { board: clearedBoard, cleared } = clearLines(merged);
            setBoard(clearedBoard);
            setLines(l => l + cleared);
            setScore(s => s + (cleared === 1 ? 100 : cleared === 2 ? 300 : cleared === 3 ? 500 : cleared === 4 ? 800 : 0) * level);
            setLevel(l => Math.floor((lines + cleared) / 10) + 1);

            // Spawn next
            const np = nextPiece;
            if (collides(clearedBoard, np)) {
                setGameOver(true);
                return;
            }
            setPiece(np);
            setNextPiece(randomPiece());
        }
    }, [board, piece, nextPiece, gameOver, paused, level, lines, gameStarted]);

    useEffect(() => {
        if (!gameStarted || gameOver || paused) return;
        const speed = Math.max(100, TICK_MS - (level - 1) * 40);
        const timer = setInterval(tick, speed);
        return () => clearInterval(timer);
    }, [tick, level, gameStarted, gameOver, paused]);

    useEffect(() => {
        const handleKey = (e) => {
            if (!gameStarted) {
                if (e.key === ' ' || e.key === 'Enter') {
                    setGameStarted(true);
                    e.preventDefault();
                }
                return;
            }

            if (gameOver) {
                if (e.key === 'r' || e.key === 'R') {
                    setBoard(createBoard());
                    setPiece(randomPiece());
                    setNextPiece(randomPiece());
                    setScore(0);
                    setLines(0);
                    setLevel(1);
                    setGameOver(false);
                }
                return;
            }

            if (e.key === 'p' || e.key === 'P') {
                setPaused(p => !p);
                return;
            }

            if (paused) return;

            switch (e.key) {
                case 'ArrowLeft':
                    if (!collides(board, piece, -1, 0)) {
                        setPiece(p => ({ ...p, x: p.x - 1 }));
                    }
                    e.preventDefault();
                    break;
                case 'ArrowRight':
                    if (!collides(board, piece, 1, 0)) {
                        setPiece(p => ({ ...p, x: p.x + 1 }));
                    }
                    e.preventDefault();
                    break;
                case 'ArrowDown':
                    if (!collides(board, piece, 0, 1)) {
                        setPiece(p => ({ ...p, y: p.y + 1 }));
                    }
                    e.preventDefault();
                    break;
                case 'ArrowUp':
                    const rotated = rotate(piece.shape);
                    if (!collides(board, piece, 0, 0, rotated)) {
                        setPiece(p => ({ ...p, shape: rotated }));
                    }
                    e.preventDefault();
                    break;
                case ' ':
                    // Hard drop
                    let dropY = 0;
                    while (!collides(board, piece, 0, dropY + 1)) dropY++;
                    setPiece(p => ({ ...p, y: p.y + dropY }));
                    e.preventDefault();
                    break;
            }
        };

        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [board, piece, gameOver, paused, gameStarted]);

    // Focus game container
    useEffect(() => {
        gameRef.current?.focus();
    }, []);

    // Render board with current piece
    const displayBoard = board.map(r => [...r]);
    if (!gameOver) {
        for (let r = 0; r < piece.shape.length; r++) {
            for (let c = 0; c < piece.shape[r].length; c++) {
                if (piece.shape[r][c] && piece.y + r >= 0 && piece.y + r < ROWS) {
                    displayBoard[piece.y + r][piece.x + c] = piece.color;
                }
            }
        }
    }

    const cellSize = 20;

    return (
        <div
            ref={gameRef}
            style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}
        >
            {/* Game Board */}
            <div>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${COLS}, ${cellSize}px)`,
                    gridTemplateRows: `repeat(${ROWS}, ${cellSize}px)`,
                    border: '1px solid var(--border)',
                    background: 'var(--bg-primary)',
                }}>
                    {displayBoard.flat().map((cell, i) => (
                        <div
                            key={i}
                            style={{
                                width: cellSize,
                                height: cellSize,
                                background: cell || 'transparent',
                                border: cell ? '1px solid rgba(0,0,0,0.3)' : '1px solid var(--border-dim)',
                                boxSizing: 'border-box',
                                boxShadow: cell ? `0 0 4px ${cell}44` : 'none',
                            }}
                        />
                    ))}
                </div>

                {gameOver && (
                    <div style={{
                        marginTop: 12,
                        textAlign: 'center',
                        padding: '10px',
                        border: '1px solid var(--error)',
                    }}>
                        <div style={{ color: 'var(--error)', fontSize: 14, fontWeight: 600 }}>GAME OVER</div>
                        <div style={{ color: 'var(--text-dim)', fontSize: 11, marginTop: 4 }}>
                            Press [R] to restart
                        </div>
                    </div>
                )}

                {paused && !gameOver && gameStarted && (
                    <div style={{
                        marginTop: 12,
                        textAlign: 'center',
                        padding: '10px',
                        border: '1px solid var(--warning)',
                    }}>
                        <div style={{ color: 'var(--warning)', fontSize: 14 }}>⏸ PAUSED</div>
                        <div style={{ color: 'var(--text-dim)', fontSize: 11, marginTop: 4 }}>Press [P] to resume</div>
                    </div>
                )}

                {!gameStarted && (
                    <div style={{ marginTop: 12, textAlign: 'center' }}>
                        <button
                            className="snake-start-btn"
                            onClick={() => {
                                setGameStarted(true);
                                setTimeout(() => gameRef.current?.focus(), 10);
                            }}
                        >
                            ▶ START GAME
                        </button>
                    </div>
                )}
            </div>

            {/* Side Panel */}
            <div style={{ minWidth: 120 }}>
                <div style={{ color: 'var(--accent)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>
                    🎮 Tetris
                </div>

                {/* Stats */}
                <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 10, color: 'var(--text-dim)', marginBottom: 4 }}>SCORE</div>
                    <div style={{ fontSize: 18, color: 'var(--accent)', fontWeight: 600 }}>{score}</div>
                </div>
                <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 10, color: 'var(--text-dim)', marginBottom: 4 }}>LINES</div>
                    <div style={{ fontSize: 14, color: 'var(--text-primary)' }}>{lines}</div>
                </div>
                <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 10, color: 'var(--text-dim)', marginBottom: 4 }}>LEVEL</div>
                    <div style={{ fontSize: 14, color: 'var(--text-primary)' }}>{level}</div>
                </div>

                {/* Next Piece */}
                <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 10, color: 'var(--text-dim)', marginBottom: 8 }}>NEXT</div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${nextPiece.shape[0].length}, 16px)`,
                        gap: 0,
                        padding: 6,
                        border: '1px solid var(--border-dim)',
                        width: 'fit-content',
                    }}>
                        {nextPiece.shape.flat().map((cell, i) => (
                            <div
                                key={i}
                                style={{
                                    width: 16,
                                    height: 16,
                                    background: cell ? nextPiece.color : 'transparent',
                                    border: cell ? '1px solid rgba(0,0,0,0.3)' : 'none',
                                    boxSizing: 'border-box',
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Controls */}
                <div style={{
                    borderTop: '1px solid var(--border-dim)',
                    paddingTop: 12,
                    fontSize: 9,
                    color: 'var(--text-dim)',
                    lineHeight: 2,
                }}>
                    <div>← → Move</div>
                    <div>↑ Rotate</div>
                    <div>↓ Soft drop</div>
                    <div>Space Hard drop</div>
                    <div>[P] Pause</div>
                    <div>[R] Restart</div>
                </div>
            </div>
        </div>
    );
}
