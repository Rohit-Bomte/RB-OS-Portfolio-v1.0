import { projects } from '../data/profileData';

export default function Projects() {
    return (
        <div>
            <div style={{ color: 'var(--accent)', fontSize: '11px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '2px' }}>
                📁 Projects / Case Studies
            </div>
            <div className="projects-grid">
                {projects.map((project, i) => (
                    <div key={i} className="project-card" onClick={() => window.open(project.github, '_blank')}>
                        <div className="project-card-header">
                            <span className="project-icon">{project.icon}</span>
                            <span className="project-title">{project.title}</span>
                        </div>
                        <p className="project-desc">{project.description}</p>
                        <div className="project-tech">
                            {project.tech.map(t => (
                                <span key={t} className="project-tech-tag">{t}</span>
                            ))}
                        </div>
                        <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="project-link"
                            onClick={e => e.stopPropagation()}
                        >
                            → View on GitHub
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}
