import { profile, experience, education, certifications } from '../data/profileData';

export default function Resume() {
    const handleDownload = () => {
        window.open('https://drive.google.com/uc?export=download&id=1qICLDujyDWVut3QWMtPYeMEIFRfmj-g_', '_blank');
    };

    return (
        <div className="resume-viewer">
            {/* Toolbar */}
            <div className="resume-toolbar">
                <span className="resume-title-badge">RESUME.EXE — {profile.name.toUpperCase()}</span>
                <button className="resume-download" onClick={handleDownload}>
                    📥 DOWNLOAD
                </button>
            </div>

            {/* Resume Card */}
            <div className="resume-card">
                {/* Header */}
                <div className="resume-card-header">
                    <div className="resume-card-name">— {profile.name.toUpperCase()} —</div>
                    <div className="resume-card-role">{profile.title}</div>
                    <div className="resume-card-contact">
                        {profile.email} • {profile.location}
                    </div>
                </div>

                {/* Summary */}
                <div className="resume-card-section">
                    <h3 className="resume-card-heading">— SUMMARY —</h3>
                    <p className="resume-card-text" style={{ fontWeight: 600 }}>
                        {profile.bio}
                    </p>
                </div>

                {/* Experience */}
                <div className="resume-card-section">
                    <h3 className="resume-card-heading">— EXPERIENCE —</h3>
                    {experience.map((exp, i) => (
                        <div key={i} className="resume-card-entry">
                            <div className="resume-card-period">[{exp.period.toUpperCase()}]</div>
                            <div className="resume-card-entry-title">
                                {exp.company} — {exp.role}
                            </div>
                            <div className="resume-card-entry-desc">{exp.description}</div>
                        </div>
                    ))}
                </div>

                {/* Education */}
                <div className="resume-card-section">
                    <h3 className="resume-card-heading">— EDUCATION —</h3>
                    <div className="resume-card-entry">
                        <div className="resume-card-entry-title">
                            › {education.degree} — {education.institution} ({education.period})
                        </div>
                        <div className="resume-card-entry-desc">CGPA: {education.cgpa}</div>
                    </div>
                </div>

                {/* Certifications */}
                <div className="resume-card-section">
                    <h3 className="resume-card-heading">— CERTIFICATIONS —</h3>
                    {certifications.map((cert, i) => (
                        <div key={i} className="resume-card-cert">
                            {cert.credentialUrl ? (
                                <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">
                                    ✓ {cert.name} — {cert.org}
                                </a>
                            ) : (
                                <span>✓ {cert.name} — {cert.org}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
