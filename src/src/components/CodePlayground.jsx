import { useState, useRef, useEffect } from 'react';

export default function CodePlayground() {
    const [code, setCode] = useState(
        `# 🐍 Python Playground — Write & Run!

print("Hello from RB-OS! 🖥️")

def greet(name):
    return f"Welcome, {name}!"

print(greet("Visitor"))`
    );
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadMsg, setLoadMsg] = useState('⏳ Loading Python runtime...');
    const pyRef = useRef(null);
    const textareaRef = useRef(null);

    // Load Pyodide on mount
    useEffect(() => {
        let cancelled = false;

        async function initPyodide() {
            try {
                if (!window.loadPyodide) {
                    setLoadMsg('⏳ Downloading Python runtime...');
                    const script = document.createElement('script');
                    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js';
                    document.head.appendChild(script);
                    await new Promise((resolve, reject) => {
                        script.onload = resolve;
                        script.onerror = () => reject(new Error('Failed to load Pyodide CDN'));
                    });
                }

                setLoadMsg('⏳ Initializing Python interpreter...');
                const py = await window.loadPyodide({
                    indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/',
                });

                if (!cancelled) {
                    pyRef.current = py;
                    setLoading(false);
                    setLoadMsg('');
                }
            } catch (err) {
                if (!cancelled) {
                    setLoadMsg(`❌ ${err.message}`);
                    setLoading(false);
                }
            }
        }

        initPyodide();
        return () => { cancelled = true; };
    }, []);

    const runCode = async () => {
        const py = pyRef.current;
        if (!py) {
            setOutput('⏳ Python is still loading, please wait...');
            return;
        }

        setOutput('▶ Running...');

        try {
            // Redirect stdout/stderr
            py.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
`);

            // Run user code
            py.runPython(code);

            // Capture output
            const stdout = py.runPython('sys.stdout.getvalue()');
            const stderr = py.runPython('sys.stderr.getvalue()');

            // Reset
            py.runPython(`
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
`);

            let result = '';
            if (stdout) result += stdout;
            if (stderr) result += (result ? '\n' : '') + '⚠️ ' + stderr;
            setOutput(result || '(no output)');
        } catch (err) {
            // Reset stdout/stderr on error too
            try {
                py.runPython(`
import sys
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
`);
            } catch (_) { /* ignore */ }

            // Clean up error message
            const msg = err.message || String(err);
            const lines = msg.split('\n');
            // Show just the last meaningful error line
            const lastLine = lines.filter(l => l.trim()).pop() || msg;
            setOutput(`❌ ${lastLine}`);
        }
    };

    const clearOutput = () => {
        setOutput('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;
            setCode(code.substring(0, start) + '    ' + code.substring(end));
            setTimeout(() => {
                textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
            }, 0);
        }
        if (e.ctrlKey && e.key === 'Enter') {
            runCode();
        }
    };

    return (
        <div className="playground">
            <div className="playground-header">
                CODE_PLAYGROUND.PY — WRITE & RUN PYTHON
                {loading && (
                    <span style={{ marginLeft: 12, fontSize: 10, color: 'var(--warning)', animation: 'pulse 1.5s infinite' }}>
                        {loadMsg}
                    </span>
                )}
                {!loading && pyRef.current && (
                    <span style={{ marginLeft: 12, fontSize: 10, color: 'var(--accent)' }}>
                        🐍 Python Ready
                    </span>
                )}
            </div>
            <textarea
                ref={textareaRef}
                className="playground-editor"
                value={code}
                onChange={e => setCode(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                autoComplete="off"
            />
            <div className="playground-controls">
                <button
                    className="playground-run"
                    onClick={runCode}
                    disabled={loading}
                    style={{ opacity: loading ? 0.5 : 1 }}
                >
                    ▶ RUN
                </button>
                <button className="playground-clear" onClick={clearOutput}>
                    CLEAR
                </button>
                <span className="playground-hint">Ctrl+Enter to run</span>
            </div>
            {output && (
                <div className="playground-output">
                    <div className="playground-output-label">OUTPUT:</div>
                    <pre className="playground-output-text">{output}</pre>
                </div>
            )}
        </div>
    );
}
