import { certifications } from '../data/profileData';

export default function Awards() {
    return (
        <div>
            <div style={{ color: 'var(--accent)', fontSize: '11px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '2px' }}>
                🏆 Achievements & Awards
            </div>

            <div style={{ color: 'var(--text-dim)', fontSize: '11px', marginBottom: '12px', borderBottom: '1px solid var(--border-dim)', paddingBottom: '4px' }}>
                — Certifications —
            </div>

            <div className="cert-list">
                {certifications.map((cert, i) => (
                    <div key={i} className="cert-item">
                        <span className="cert-icon">{cert.icon}</span>
                        <div className="cert-info">
                            <div className="cert-name">
                                {cert.credentialUrl ? (
                                    <a
                                        href={cert.credentialUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            color: 'var(--accent)',
                                            textDecoration: 'none',
                                            cursor: 'pointer',
                                        }}
                                        onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                                        onMouseLeave={e => e.target.style.textDecoration = 'none'}
                                    >
                                        {cert.name} 🔗
                                    </a>
                                ) : (
                                    cert.name
                                )}
                            </div>
                            <div className="cert-org">{cert.org}</div>
                        </div>
                        <span className="cert-year">{cert.year}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
