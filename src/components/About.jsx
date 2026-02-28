import { profile, education } from '../data/profileData';

export default function About() {
    return (
        <div>
            <div className="status-badge">
                <span className="status-dot"></span>
                Available for opportunities
            </div>

            <div className="about-section">
                <h3>/// Personal Info</h3>
                <div className="about-field">
                    <span className="about-label">Name:</span>
                    <span className="about-value">{profile.name}</span>
                </div>
                <div className="about-field">
                    <span className="about-label">Role:</span>
                    <span className="about-value">{profile.title}</span>
                </div>
                <div className="about-field">
                    <span className="about-label">Location:</span>
                    <span className="about-value">{profile.location}</span>
                </div>
                <div className="about-field">
                    <span className="about-label">Email:</span>
                    <span className="about-value">
                        <a href={profile.links.email}>{profile.email}</a>
                    </span>
                </div>
            </div>

            <div className="about-section">
                <h3>/// Education</h3>
                <div className="about-field">
                    <span className="about-label">Degree:</span>
                    <span className="about-value">{education.degree}</span>
                </div>
                <div className="about-field">
                    <span className="about-label">Institution:</span>
                    <span className="about-value">{education.institution}</span>
                </div>
                <div className="about-field">
                    <span className="about-label">Period:</span>
                    <span className="about-value">{education.period}</span>
                </div>
                <div className="about-field">
                    <span className="about-label">CGPA:</span>
                    <span className="about-value" style={{ color: 'var(--accent)' }}>{education.cgpa}</span>
                </div>
            </div>

            <div className="about-section">
                <h3>/// About</h3>
                <p className="about-bio">{profile.bio}</p>
                <p className="about-quote">{profile.quote}</p>
            </div>

            <div className="about-section">
                <h3>/// Links</h3>
                <div className="about-field">
                    <span className="about-label">LinkedIn:</span>
                    <span className="about-value">
                        <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">linkedin.com/in/rohit-bomte</a>
                    </span>
                </div>
                <div className="about-field">
                    <span className="about-label">GitHub:</span>
                    <span className="about-value">
                        <a href={profile.links.github} target="_blank" rel="noopener noreferrer">github.com/Rohit-Bomte</a>
                    </span>
                </div>
                <div className="about-field">
                    <span className="about-label">Portfolio:</span>
                    <span className="about-value">
                        <a href={profile.links.portfolio} target="_blank" rel="noopener noreferrer">rohitbomte.vercel.app</a>
                    </span>
                </div>
            </div>
        </div>
    );
}
