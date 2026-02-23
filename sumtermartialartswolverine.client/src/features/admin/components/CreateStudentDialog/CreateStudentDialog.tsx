import { useState } from 'react';
import './CreateStudentDialog.css';

interface CreateStudentDialogProps {
    onClose: (studentData?: { name: string; email: string; phone: string }) => void;
}

function CreateStudentDialog({ onClose }: CreateStudentDialogProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const canSubmit = !!(
        name.trim() &&
        email.trim() &&
        isValidEmail(email) &&
        phone.trim() &&
        !isSubmitting
    );

    const handleCancel = () => {
        onClose();
    };

    const handleSubmit = () => {
        if (!canSubmit) return;

        setIsSubmitting(true);
        onClose({
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim()
        });
    };

    return (
        <div className="dialog-overlay" onClick={handleCancel}>
            <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
                <h2 className="dialog-title">Create New Student</h2>

                <div className="dialog-body">
                    <div className="dialog-form">
                        <p className="info-text">
                            Add a new student to the system. You'll be able to enroll them in programs after creation.
                        </p>

                        {/* Student Name */}
                        <div className="form-field">
                            <label htmlFor="name">Full Name *</label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., John Smith"
                                required
                                autoComplete="name"
                            />
                        </div>

                        {/* Email */}
                        <div className="form-field">
                            <label htmlFor="email">Email Address *</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="e.g., john.smith@email.com"
                                required
                                autoComplete="email"
                                className={email && !isValidEmail(email) ? 'error' : ''}
                            />
                            {email && !isValidEmail(email) && (
                                <span className="error-text">Please enter a valid email address</span>
                            )}
                        </div>

                        {/* Phone */}
                        <div className="form-field">
                            <label htmlFor="phone">Phone Number *</label>
                            <input
                                id="phone"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="e.g., (555) 123-4567"
                                required
                                autoComplete="tel"
                            />
                        </div>

                        {/* Info Box */}
                        <div className="info-box">
                            <span>
                                After creating the student, you'll be able to enroll them in programs
                                and start tracking their belt progression.
                            </span>
                        </div>
                    </div>
                </div>

                <div className="dialog-actions">
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="btn-primary"
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="spinner-small"></span>
                                <span>Creating...</span>
                            </>
                        ) : (
                            'Create Student'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateStudentDialog;