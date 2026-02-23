import { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { emailTemplatesService } from '../../services/emailTemplatesService';
import { EmailTemplateDetail } from '../../models/emailTemplate.model';
import './EmailTemplateEdit.css';

function EmailTemplateEdit() {
    const [template, setTemplate] = useState<EmailTemplateDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        const templateId = Number(id);
        if (templateId) {
            loadTemplate(templateId);
        }
    }, [id]);

    const loadTemplate = async (templateId: number) => {
        setLoading(true);
        setError('');

        try {
            const data = await emailTemplatesService.getTemplateById(templateId);
            setTemplate(data);
        } catch (err) {
            setError('Failed to load email template');
            console.error('Error loading template:', err);
        } finally {
            setLoading(false);
        }
    };

    const saveTemplate = async (e: FormEvent) => {
        e.preventDefault();

        if (!template) return;

        setSaving(true);
        setError('');
        setSuccessMessage('');

        const request = {
            name: template.name,
            subject: template.subject,
            body: template.body,
            description: template.description
        };

        try {
            await emailTemplatesService.updateTemplate(template.id, request);
            setSuccessMessage('Template updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError('Failed to update template');
            console.error('Error updating template:', err);
        } finally {
            setSaving(false);
        }
    };

    const cancel = () => {
        navigate('/admin/email-templates');
    };

    const updateTemplate = (field: keyof EmailTemplateDetail, value: any) => {
        if (template) {
            setTemplate({ ...template, [field]: value });
        }
    };

    return (
        <div className="edit-container">
            <div className="header">
                <button className="back-button" onClick={cancel}>
                    ? Back to Templates
                </button>
                <h1>Edit Email Template</h1>
            </div>

            {loading && <div className="loading">Loading template...</div>}
            {error && <div className="error">{error}</div>}
            {successMessage && <div className="success">{successMessage}</div>}

            {template && !loading && (
                <form onSubmit={saveTemplate}>
                    <div className="form-group">
                        <label>Template Key (Read-only)</label>
                        <input
                            type="text"
                            value={template.templateKey}
                            disabled
                            className="readonly"
                        />
                    </div>

                    <div className="form-group">
                        <label>Template Name *</label>
                        <input
                            type="text"
                            value={template.name}
                            onChange={(e) => updateTemplate('name', e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Subject Line *</label>
                        <input
                            type="text"
                            value={template.subject}
                            onChange={(e) => updateTemplate('subject', e.target.value)}
                            required
                        />
                        <small className="hint">
                            You can use variables like {'{{StudentName}}'}, {'{{InstructorName}}'}, etc.
                        </small>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={template.description || ''}
                            onChange={(e) => updateTemplate('description', e.target.value)}
                            rows={2}
                        />
                    </div>

                    <div className="form-group">
                        <label>Email Body (HTML) *</label>
                        <textarea
                            value={template.body}
                            onChange={(e) => updateTemplate('body', e.target.value)}
                            rows={20}
                            required
                            className="code-editor"
                        />
                        <small className="hint">
                            Full HTML template. Available variables vary by template - check description.
                        </small>
                    </div>

                    <div className="form-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={template.isActive}
                                onChange={(e) => updateTemplate('isActive', e.target.checked)}
                            />
                            Active (template will be used when sending emails)
                        </label>
                    </div>

                    <div className="actions">
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={cancel}
                            disabled={saving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default EmailTemplateEdit;