import { skills } from '../data/profileData';

export default function Skills() {
    return (
        <div>
            <div style={{ color: 'var(--accent)', fontSize: '11px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '2px' }}>
                ⚙ Tech Stack Configuration
            </div>
            <div className="skills-grid">
                {Object.entries(skills).map(([category, items]) => (
                    <div key={category} className="skill-category">
                        <h4>{'>'} {category}</h4>
                        <div className="skill-tags">
                            {items.map(skill => (
                                <span key={skill} className="skill-tag">{skill}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
