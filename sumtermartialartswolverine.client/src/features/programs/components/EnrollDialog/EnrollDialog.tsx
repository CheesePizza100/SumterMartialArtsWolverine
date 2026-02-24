import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Program } from '../../models/program.model';
import './EnrollDialog.css';

interface EnrollDialogProps {
    program: Program;
    onClose: (enrollmentData?: any) => void;
}

interface FormData {
    name: string;
    email: string;
    phone: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    phone?: string;
}

function EnrollDialog({ program, onClose }: EnrollDialogProps) {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: ''
    });
    const [errors, setErrors] = useState<FormErrors>({});

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        const enrollmentData = {
            programId: program.id,
            programName: program.name,
            ...formData
        };

        // TODO: Call enrollment API
        console.log('Enrollment submitted:', enrollmentData);
        onClose(enrollmentData);
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <div className="dialog-overlay" onClick={handleCancel}>
            <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
                <h2 className="dialog-title">Enroll in {program.name}</h2>

                <div className="dialog-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-field">
                            <label htmlFor="name">Full Name *</label>
                            <input
                                id="name"
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className={errors.name ? 'error' : ''}
                            />
                            {errors.name && <span className="error-text">{errors.name}</span>}
                        </div>

                        <div className="form-field">
                            <label htmlFor="email">Email *</label>
                            <input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className={errors.email ? 'error' : ''}
                            />
                            {errors.email && <span className="error-text">{errors.email}</span>}
                        </div>

                        <div className="form-field">
                            <label htmlFor="phone">Phone *</label>
                            <input
                                id="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className={errors.phone ? 'error' : ''}
                            />
                            {errors.phone && <span className="error-text">{errors.phone}</span>}
                        </div>
                    </form>
                </div>

                <div className="dialog-actions">
                    <button type="button" className="btn-secondary" onClick={handleCancel}>
                        Cancel
                    </button>
                    <button type="submit" className="btn-primary" onClick={handleSubmit}>
                        Submit Enrollment
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EnrollDialog;