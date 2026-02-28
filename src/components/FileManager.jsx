import { useState } from 'react';
import { projects } from '../data/profileData';

const FILE_TREE = {
    name: 'C:\\',
    type: 'root',
    children: [
        {
            name: 'Projects',
            type: 'folder',
            icon: '📁',
            children: projects.map(p => ({
                name: p.title,
                type: 'file',
                icon: p.icon || '📄',
                meta: p.description,
                link: p.github,
                tech: p.tech,
            })),
        },
        {
            name: 'Games',
            type: 'folder',
            icon: '🎮',
            children: [
                { name: 'Tetris.exe', type: 'file', icon: '🧱', meta: 'Classic block puzzle game' },
                { name: 'Snake.exe', type: 'file', icon: '🐍', meta: 'Retro snake game' },
            ],
        },
        {
            name: 'System',
            type: 'folder',
            icon: '⚙️',
            children: [
                { name: 'config.sys', type: 'file', icon: '📋', meta: 'System configuration' },
                { name: 'autoexec.bat', type: 'file', icon: '📋', meta: 'Startup commands' },
                { name: 'display.cfg', type: 'file', icon: '🖥️', meta: 'Display settings' },
                { name: 'profile.dat', type: 'file', icon: '👤', meta: 'User profile data' },
            ],
        },
        {
            name: 'Documents',
            type: 'folder',
            icon: '📂',
            children: [
                { name: 'resume.pdf', type: 'file', icon: '📄', meta: 'Professional resume' },
                { name: 'certifications.txt', type: 'file', icon: '🏆', meta: 'Certification records' },
            ],
        },
    ],
};

export default function FileManager() {
    const [path, setPath] = useState([FILE_TREE]);
    const current = path[path.length - 1];

    const navigateTo = (item) => {
        if (item.type === 'folder') {
            setPath([...path, item]);
        } else if (item.link) {
            window.open(item.link, '_blank');
        }
    };

    const goBack = () => {
        if (path.length > 1) {
            setPath(path.slice(0, -1));
        }
    };

    const pathString = path.map(p => p.name).join('\\');

    return (
        <div className="file-manager">
            <div className="fm-toolbar">
                <button
                    className="fm-back"
                    onClick={goBack}
                    disabled={path.length <= 1}
                >
                    ← Back
                </button>
                <div className="fm-path">
                    📂 {pathString}
                </div>
            </div>

            <div className="fm-listing">
                {current.children && current.children.map((item, i) => (
                    <div
                        key={i}
                        className={`fm-item ${item.type}`}
                        onClick={() => navigateTo(item)}
                    >
                        <span className="fm-icon">{item.icon}</span>
                        <div className="fm-info">
                            <div className="fm-name">{item.name}</div>
                            {item.meta && (
                                <div className="fm-meta">{item.meta}</div>
                            )}
                            {item.tech && (
                                <div className="fm-tech">
                                    {item.tech.map((t, j) => (
                                        <span key={j} className="fm-tech-tag">{t}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                        <span className="fm-type">
                            {item.type === 'folder' ? '📁 DIR' : '📄 FILE'}
                        </span>
                    </div>
                ))}
            </div>

            <div className="fm-statusbar">
                {current.children?.length || 0} items • {pathString}
            </div>
        </div>
    );
}
