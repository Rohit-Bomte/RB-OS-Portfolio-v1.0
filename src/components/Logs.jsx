import { experience, education, certifications } from '../data/profileData';

function formatLogDate(period) {
    return period.toUpperCase();
}

export default function Logs() {
    const allEntries = [];

    // Experience entries
    experience.forEach(exp => {
        allEntries.push({
            date: exp.period,
            type: 'CAREER',
            title: `${exp.role} @ ${exp.company}`,
            details: [exp.description],
            icon: exp.icon || '💼',
        });
    });

    // Education entry (single object, not array)
    allEntries.push({
        date: education.period,
        type: 'EDUCATION',
        title: `${education.degree} — ${education.institution}`,
        details: [`CGPA: ${education.cgpa}`],
        icon: '🎓',
    });

    // Certification entries
    certifications.forEach(cert => {
        allEntries.push({
            date: cert.year || '2024',
            type: 'CERTIFICATION',
            title: `${cert.name} — ${cert.org}`,
            details: [],
            icon: cert.icon || '🏆',
        });
    });

    return (
        <div className="logs-viewer">
            <div className="logs-header">
                <span>SYSTEM_LOGS.TXT — Career Activity Log</span>
                <span style={{ color: 'var(--text-dim)', fontSize: 10 }}>
                    {allEntries.length} entries
                </span>
            </div>

            <div className="logs-content">
                {allEntries.map((entry, i) => (
                    <div key={i} className="log-entry">
                        <div className="log-date-header">
                            [{formatLogDate(entry.date)}] [{entry.type}]
                        </div>
                        <div className="log-title">
                            {entry.icon} {entry.title}
                        </div>
                        {entry.details.length > 0 && (
                            <div className="log-details">
                                {entry.details.map((d, j) => (
                                    <div key={j} className="log-detail-line">
                                        <span className="log-arrow">→</span> {d}
                                    </div>
                                ))}
                            </div>
                        )}
                        {i < allEntries.length - 1 && (
                            <div className="log-separator">
                                {'─'.repeat(50)}
                            </div>
                        )}
                    </div>
                ))}

                <div className="log-entry" style={{ marginTop: 16 }}>
                    <div className="log-date-header">[SYSTEM]</div>
                    <div className="log-title">
                        📋 End of log. Type 'help' in terminal for more commands.
                    </div>
                </div>
            </div>
        </div>
    );
}
