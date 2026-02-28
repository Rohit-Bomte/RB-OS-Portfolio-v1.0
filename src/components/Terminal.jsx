import { useState, useRef, useEffect } from 'react';
import { profile, education, skills as skillsData } from '../data/profileData';

const COWSAY = (msg) => `
  ${'_'.repeat(msg.length + 2)}
 < ${msg} >
  ${'‾'.repeat(msg.length + 2)}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`;

const FORTUNES = [
    '"The best way to predict the future is to invent it." — Alan Kay',
    '"Data is the new oil." — Clive Humby',
    '"Any fool can write code that a computer can understand. Good programmers write code that humans can understand." — Martin Fowler',
    '"First, solve the problem. Then, write the code." — John Johnson',
    '"Without data, you\'re just another person with an opinion." — W. Edwards Deming',
    '"The goal is to turn data into information, and information into insight." — Carly Fiorina',
    '"Code never lies, comments sometimes do." — Ron Jeffries',
    '"In God we trust; all others bring data." — W. Edwards Deming',
];

const CAT_ASCII = `
    /\\_/\\  
   ( o.o ) 
    > ^ <
   /|   |\\
  (_|   |_)
    Meow! 🐱`;

const COFFEE_ASCII = `
      )  (
     (   ) )
      ) ( (
    ________
   |        |]
   \\        /
    \\______/
  
  ☕ Brewing fresh coffee...
  Done! Here's your virtual coffee.`;

const COMMANDS = {
    help: () => `Available commands:

  ℹ️  Navigation:
  help        — Show this help message
  about       — About Rohit Bomte
  neofetch    — System info
  skills      — Technical skills
  education   — Education details
  contact     — Show contact info
  
  📂 System:
  ls          — List windows/apps
  clear       — Clear terminal
  echo <msg>  — Echo a message
  date        — Current date/time
  whoami      — Current user
  
  🚀 Apps:
  playground  — Open Python Playground
  tetris      — Play Tetris
  snake       — Play Snake
  display     — Open Display Settings
  
  🥚 Easter eggs:
  cowsay      — 🐮 Moo!
  fortune     — 🔮 Random fortune
  coffee      — ☕ Brew some coffee
  cat         — 🐱 A friendly cat
  ...and more hidden ones 👀`,

    about: () => `${profile.name}
${profile.title}
${profile.location}

${profile.bio}

${profile.quote}`,

    neofetch: () => `
  root@rohit-os
  ──────────────
  OS:       RB-OS v1.0
  Host:     Portfolio Terminal
  Kernel:   React 19.x
  Shell:    rb-sh 1.0
  User:     ${profile.name}
  Role:     ${profile.title}
  Location: ${profile.location}
  CGPA:     ${education.cgpa}
  Email:    ${profile.email}
  GitHub:   github.com/Rohit-Bomte
  Uptime:   since Jul 2025`,

    skills: () => {
        return Object.entries(skillsData)
            .map(([cat, items]) => `  [${cat}]\n    ${items.join(', ')}`)
            .join('\n\n');
    },

    education: () => `  ${education.degree}
  ${education.institution}
  ${education.period}
  CGPA: ${education.cgpa}`,

    contact: () => `  📧 Email:    ${profile.email}
  🔗 LinkedIn: ${profile.links.linkedin}
  🐙 GitHub:   ${profile.links.github}
  🌐 Portfolio: ${profile.links.portfolio}`,

    whoami: () => 'root@rohit',
    date: () => new Date().toLocaleString(),

    ls: () => `  > Terminal       — Interactive CLI
  > Files          — File Manager
  > Projects       — Project showcase
  > Logs           — System activity log
  > About          — Personal info
  > Skills         — Tech stack
  > Radar          — Skills visualization
  > Awards         — Certifications
  > Resume         — View resume
  > Python         — Python Playground
  > Display        — Theme settings
  > Tetris         — 🧱 Block puzzle
  > Snake          — 🐍 Classic snake
  > Timeline       — Career timeline`,

    cowsay: () => COWSAY('Moo! Hire Rohit!'),
    fortune: () => `🔮 ${FORTUNES[Math.floor(Math.random() * FORTUNES.length)]}`,
    coffee: () => COFFEE_ASCII,
    cat: () => CAT_ASCII,

    sudo: () => 'Nice try! You don\'t have sudo access on this portfolio 😄',
    'rm -rf': () => '🚫 PERMISSION DENIED: Cannot delete portfolio. It\'s too awesome.',
    hack: () => `
  ██ ACCESSING MAINFRAME... ██
  ████████████████████████████
  ACCESS DENIED.
  Just kidding. There's nothing to hack here 😎`,

    matrix: () => `
  Wake up, Rohit...
  The Matrix has you...
  Follow the white rabbit.
  ██████████████████████████
  🐇`,

    ping: () => `PING rohit-portfolio.rb (127.0.0.1): 56 data bytes
64 bytes: icmp_seq=0 ttl=64 time=0.042 ms
64 bytes: icmp_seq=1 ttl=64 time=0.038 ms
64 bytes: icmp_seq=2 ttl=64 time=0.041 ms
--- rohit-portfolio.rb ping statistics ---
3 packets transmitted, 3 received, 0% packet loss`,

    uptime: () => `System up since the Big Bang 🌌
Honestly, since you opened this page.`,

    exit: () => '🚪 Close the terminal window to exit.',
};

export default function Terminal({ openWindow }) {
    const [history, setHistory] = useState([
        {
            type: 'ascii', text: `  ██████╗  ██████╗ ██╗  ██╗██╗████████╗
  ██╔══██╗██╔═══██╗██║  ██║██║╚══██╔══╝
  ██████╔╝██║   ██║███████║██║   ██║   
  ██╔══██╗██║   ██║██╔══██║██║   ██║   
  ██║  ██║╚██████╔╝██║  ██║██║   ██║   
  ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝   ╚═╝` },
        { type: 'output', text: '' },
        { type: 'command', prompt: 'root@rohit:~$', cmd: 'cat welcome_message.txt' },
        {
            type: 'output', text: `Welcome to RB-OS [Version 1.0.2026]
(c) Rohit Bomte. All rights reserved.

System Status: ONLINE
Memory: 640KB OK
Role: ${profile.title}
Location: ${profile.location}`
        },
        { type: 'output', text: '' },
        { type: 'command', prompt: 'root@rohit:~$', cmd: 'sh ./init_portfolio.sh' },
        { type: 'output', text: 'Portfolio initialized successfully! ✓' },
        { type: 'output', text: '' },
        { type: 'output', text: "Type 'help' for commands. Try hidden commands! 🟡" },
    ]);
    const [input, setInput] = useState('');
    const [cmdHistory, setCmdHistory] = useState([]);
    const [historyIdx, setHistoryIdx] = useState(-1);
    const endRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const cmd = input.trim();
        if (!cmd) return;

        // Save to command history
        setCmdHistory(prev => [cmd, ...prev]);
        setHistoryIdx(-1);

        const newEntries = [
            { type: 'command', prompt: 'root@rohit:~$', cmd }
        ];

        if (cmd === 'clear') {
            setHistory([]);
            setInput('');
            return;
        }

        // App-opening commands
        if ((cmd === 'playground' || cmd === 'python') && openWindow) {
            newEntries.push({ type: 'output', text: '🐍 Opening Python playground...' });
            setHistory(prev => [...prev, ...newEntries]);
            setInput('');
            setTimeout(() => openWindow('code'), 200);
            return;
        }
        if (cmd === 'tetris' && openWindow) {
            newEntries.push({ type: 'output', text: 'Launching Tetris...' });
            setHistory(prev => [...prev, ...newEntries]);
            setInput('');
            setTimeout(() => openWindow('tetris'), 200);
            return;
        }
        if (cmd === 'snake' && openWindow) {
            newEntries.push({ type: 'output', text: 'Launching Snake...' });
            setHistory(prev => [...prev, ...newEntries]);
            setInput('');
            setTimeout(() => openWindow('snake'), 200);
            return;
        }
        if (cmd === 'display' && openWindow) {
            newEntries.push({ type: 'output', text: 'Opening Display Settings...' });
            setHistory(prev => [...prev, ...newEntries]);
            setInput('');
            setTimeout(() => openWindow('display'), 200);
            return;
        }

        const handler = COMMANDS[cmd] || COMMANDS[cmd.split(' ')[0]];
        if (handler) {
            newEntries.push({ type: 'output', text: handler() });
        } else if (cmd.startsWith('echo ')) {
            newEntries.push({ type: 'output', text: cmd.slice(5) });
        } else {
            newEntries.push({ type: 'output', text: `rb-sh: command not found: ${cmd}\nType 'help' for available commands.` });
        }

        setHistory(prev => [...prev, ...newEntries]);
        setInput('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (cmdHistory.length > 0) {
                const idx = Math.min(historyIdx + 1, cmdHistory.length - 1);
                setHistoryIdx(idx);
                setInput(cmdHistory[idx]);
            }
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIdx > 0) {
                const idx = historyIdx - 1;
                setHistoryIdx(idx);
                setInput(cmdHistory[idx]);
            } else {
                setHistoryIdx(-1);
                setInput('');
            }
        }
    };

    return (
        <div className="terminal" onClick={() => inputRef.current?.focus()}>
            {history.map((entry, i) => (
                <div key={i} className="terminal-line">
                    {entry.type === 'ascii' && (
                        <pre style={{ color: 'var(--accent)', fontSize: '10px', lineHeight: '1.1', textShadow: 'var(--glow-small)' }}>{entry.text}</pre>
                    )}
                    {entry.type === 'command' && (
                        <>
                            <span className="terminal-prompt">{entry.prompt} </span>
                            <span className="terminal-command">{entry.cmd}</span>
                        </>
                    )}
                    {entry.type === 'output' && (
                        <span className="terminal-output">{entry.text}</span>
                    )}
                </div>
            ))}
            <form onSubmit={handleSubmit} className="terminal-input-line">
                <span className="terminal-prompt">root@rohit:~$ </span>
                <input
                    ref={inputRef}
                    className="terminal-input"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    spellCheck={false}
                />
            </form>
            <div ref={endRef} />
        </div>
    );
}
