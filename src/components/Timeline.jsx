import { experience, education } from '../data/profileData';

export default function Timeline() {
    return (
        <div>
            <div style={{ color: 'var(--accent)', fontSize: '11px', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '2px' }}>
                📅 Career Timeline
            </div>
            <div className="timeline">
                {experience.map((exp, i) => (
                    <div key={i} className="timeline-item">
                        <div className="timeline-dot" />
                        <div className="timeline-period">
                            <span className="timeline-period-icon">{exp.icon}</span>
                            {exp.period}
                        </div>
                        <div className="timeline-role">{exp.role}</div>
                        <div className="timeline-company">{exp.company}</div>
                        <div className="timeline-desc">{exp.description}</div>
                    </div>
                ))}
                <div className="timeline-item">
                    <div className="timeline-dot" />
                    <div className="timeline-period">
                        <span className="timeline-period-icon">🎓</span>
                        {education.period}
                    </div>
                    <div className="timeline-role">{education.degree}</div>
                    <div className="timeline-company">{education.institution}</div>
                    <div className="timeline-desc">CGPA: {education.cgpa}</div>
                </div>
            </div>
        </div>
    );
}
