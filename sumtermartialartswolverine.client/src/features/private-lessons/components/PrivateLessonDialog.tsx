import { useState, useEffect } from 'react';
import { privateLessonsService } from '../services/privateLessonsService';
import type { LessonTime, PrivateLessonRequest } from '../models/private-lesson.model';
import './PrivateLessonDialog.css';

interface PrivateLessonDialogProps {
    instructorId: number;
    instructorName: string;
    onClose: (success: boolean) => void;
}

interface FormData {
    studentName: string;
    studentEmail: string;
    studentPhone: string;
    preferredDate: string;
    selectedSlot: LessonTime | null;
    notes: string;
}

interface FormErrors {
    studentName?: string;
    studentEmail?: string;
    preferredDate?: string;
    selectedSlot?: string;
}

function PrivateLessonDialog({ instructorId, instructorName, onClose }: PrivateLessonDialogProps) {
    const [formData, setFormData] = useState<FormData>({
        studentName: '',
        studentEmail: '',
        studentPhone: '',
        preferredDate: '',
        selectedSlot: null,
        notes: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [availableSlots, setAvailableSlots] = useState<LessonTime[]>([]);
    //const [availableDates, setAvailableDates] = useState<Date[]>([]);
    const [filteredSlots, setFilteredSlots] = useState<LessonTime[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string>();

    useEffect(() => {
        loadAvailability();
    }, [instructorId]);

    const loadAvailability = async () => {
        try {
            const slots = await privateLessonsService.getInstructorAvailability(instructorId, 30);
            setAvailableSlots(slots);

            // Extract unique dates from slots
            const availableDates = [...new Set(
                slots.map(slot => new Date(slot.start).toDateString())
            )].map(dateStr => new Date(dateStr));

            //setAvailableDates(availableDates);
            setIsLoading(false);
        } catch (err) {
            console.error('Error loading availability:', err);
            setError('Failed to load available dates');
            setIsLoading(false);
        }
    };

    const handleDateChange = (dateString: string) => {
        setFormData(prev => ({ ...prev, preferredDate: dateString, selectedSlot: null }));

        if (!dateString) {
            setFilteredSlots([]);
            return;
        }

        // Filter slots for the selected date
        const selectedDate = new Date(dateString);
        const selectedDateStr = selectedDate.toDateString();

        const filtered = availableSlots.filter(slot => {
            const slotDate = new Date(slot.start);
            return slotDate.toDateString() === selectedDateStr;
        });

        setFilteredSlots(filtered);
    };

    const formatTimeSlot = (slot: LessonTime): string => {
        const start = new Date(slot.start);
        const end = new Date(slot.end);
        return `${start.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit'
        })} - ${end.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit'
        })}`;
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.studentName.trim()) {
            newErrors.studentName = 'Name is required';
        }

        if (!formData.studentEmail.trim()) {
            newErrors.studentEmail = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.studentEmail)) {
            newErrors.studentEmail = 'Please enter a valid email';
        }

        if (!formData.preferredDate) {
            newErrors.preferredDate = 'Please select a date';
        }

        if (!formData.selectedSlot) {
            newErrors.selectedSlot = 'Please select a time slot';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm() || !formData.selectedSlot) return;

        setIsSubmitting(true);

        const request: PrivateLessonRequest = {
            instructorId,
            studentName: formData.studentName,
            studentEmail: formData.studentEmail,
            studentPhone: formData.studentPhone,
            requestedStart: formData.selectedSlot.start,
            requestedEnd: formData.selectedSlot.end,
            notes: formData.notes
        };

        try {
            await privateLessonsService.submitLessonRequest(request);
            onClose(true); // Success
        } catch (err) {
            console.error('Error submitting request:', err);
            setError('Failed to submit request. Please try again.');
            setIsSubmitting(false);
        }
    };

    // Generate date input's min and max
    const today = new Date().toISOString().split('T')[0];
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    const maxDateStr = maxDate.toISOString().split('T')[0];

    return (
        <div className="dialog-overlay" onClick={() => onClose(false)}>
            <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
                <h2 className="dialog-title">Book a Private Lesson with {instructorName}</h2>

                <div className="dialog-body">
                    {/* Loading State */}
                    {isLoading && (
                        <div className="loading-box">
                            <div className="spinner"></div>
                            <p>Loading availability...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !isLoading && (
                        <div className="error-box">
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    {!isLoading && !error && (
                        <form onSubmit={handleSubmit} className="lesson-form">
                            {/* Student Name */}
                            <div className="form-field">
                                <label htmlFor="studentName">Your Name *</label>
                                <input
                                    id="studentName"
                                    type="text"
                                    value={formData.studentName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, studentName: e.target.value }))}
                                    className={errors.studentName ? 'error' : ''}
                                />
                                {errors.studentName && <span className="error-text">{errors.studentName}</span>}
                            </div>

                            {/* Student Email */}
                            <div className="form-field">
                                <label htmlFor="studentEmail">Email *</label>
                                <input
                                    id="studentEmail"
                                    type="email"
                                    value={formData.studentEmail}
                                    onChange={(e) => setFormData(prev => ({ ...prev, studentEmail: e.target.value }))}
                                    className={errors.studentEmail ? 'error' : ''}
                                />
                                {errors.studentEmail && <span className="error-text">{errors.studentEmail}</span>}
                            </div>

                            {/* Student Phone */}
                            <div className="form-field">
                                <label htmlFor="studentPhone">Phone (optional)</label>
                                <input
                                    id="studentPhone"
                                    type="tel"
                                    value={formData.studentPhone}
                                    onChange={(e) => setFormData(prev => ({ ...prev, studentPhone: e.target.value }))}
                                />
                            </div>

                            {/* Preferred Date */}
                            <div className="form-field">
                                <label htmlFor="preferredDate">Preferred Date *</label>
                                <input
                                    id="preferredDate"
                                    type="date"
                                    min={today}
                                    max={maxDateStr}
                                    value={formData.preferredDate}
                                    onChange={(e) => handleDateChange(e.target.value)}
                                    className={errors.preferredDate ? 'error' : ''}
                                />
                                <span className="hint">Select from available dates</span>
                                {errors.preferredDate && <span className="error-text">{errors.preferredDate}</span>}
                            </div>

                            {/* Time Slot Selector */}
                            <div className="form-field">
                                <label htmlFor="selectedSlot">Available Time Slots *</label>
                                <select
                                    id="selectedSlot"
                                    value={formData.selectedSlot ? JSON.stringify(formData.selectedSlot) : ''}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        selectedSlot: e.target.value ? JSON.parse(e.target.value) : null
                                    }))}
                                    disabled={!formData.preferredDate || filteredSlots.length === 0}
                                    className={errors.selectedSlot ? 'error' : ''}
                                >
                                    <option value="">Select a time slot</option>
                                    {filteredSlots.map((slot, index) => (
                                        <option key={index} value={JSON.stringify(slot)}>
                                            {formatTimeSlot(slot)}
                                        </option>
                                    ))}
                                </select>
                                {!formData.preferredDate && <span className="hint">Select a date first</span>}
                                {formData.preferredDate && filteredSlots.length === 0 && (
                                    <span className="hint">No available slots for this date</span>
                                )}
                                {errors.selectedSlot && <span className="error-text">{errors.selectedSlot}</span>}
                            </div>

                            {/* Notes */}
                            <div className="form-field">
                                <label htmlFor="notes">Notes (optional)</label>
                                <textarea
                                    id="notes"
                                    value={formData.notes}
                                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                                    rows={3}
                                    placeholder="Any specific requests or questions?"
                                />
                            </div>
                        </form>
                    )}
                </div>

                {/* Dialog Actions */}
                <div className="dialog-actions">
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => onClose(false)}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn-primary"
                        onClick={handleSubmit}
                        disabled={isLoading || isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PrivateLessonDialog;