import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { emailTemplatesService } from '../../services/emailTemplatesService';
import type { EmailTemplate } from '../../models/emailTemplate.model';
import './EmailTemplates.css';

function EmailTemplates() {
    const [templates, setTemplates] = useState<EmailTemplate[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadTemplates();
    }, []);

    const loadTemplates = async () => {
        setLoading(true);
        setError('');

        try {
            const data = await emailTemplatesService.getAllTemplates();
            setTemplates(data);
        } catch (err) {
            setError('Failed to load email templates');
            console.error('Error loading templates:', err);
        } finally {
            setLoading(false);
        }
    };

    const editTemplate = (id: number) => {
        navigate(`/admin/email-templates/${id}`);
    };

    const formatDate = (dateStr: string): string => {
        return new Date(dateStr).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    };

    return (
        <div className="templates-container">
            <div className="header">
                <h1>Email Templates</h1>
                <p className="subtitle">Manage email templates sent to students and instructors</p>
            </div>

            {loading && <div className="loading">Loading templates...</div>}
            {error && <div className="error">{error}</div>}

            {!loading && !error && (
                <div className="templates-grid">
                    {templates.map((template) => (
                        <div
                            key={template.id}
                            className={`template-card ${!template.isActive ? 'inactive' : ''}`}
                            onClick={() => editTemplate(template.id)}
                        >
                            <div className="template-header">
                                <h3>{template.name}</h3>
                                <span className={`status-badge ${template.isActive ? 'active' : 'inactive'}`}>
                                    {template.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>

                            <p className="template-key">{template.templateKey}</p>
                            <p className="template-subject">{template.subject}</p>

                            {template.description && (
                                <p className="template-description">{template.description}</p>
                            )}

                            <p className="template-modified">
                                Last modified: {formatDate(template.lastModified)}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default EmailTemplates;