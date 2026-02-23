import { useState } from 'react';
import './RejectionReasonDialog.css';

interface RejectionReasonDialogProps {
    studentName: string;
    onClose: (reason?: string) => void;
}

function RejectionReasonDialog({ studentName, onClose }: RejectionReasonDialogProps) {
    const [reason, setReason] = useState('');

    const handleCancel = () => {
        onClose();
    };

    const handleSubmit = () => {
        if (reason && reason.trim().length > 0) {
            onClose(reason.trim());
        }
    };

    return (
        <div className="dialog-overlay" onClick={handleCancel}>
            <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
                <h2 className="dialog-title">Reject Lesson Request</h2>

                <div className="dialog-body">
                    <p>Please provide a reason for rejecting {studentName}'s request:</p>

                    <div className="form-field">
                        <label htmlFor="reason">Rejection Reason *</label>
                        <textarea
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={4}
                            placeholder="e.g., Instructor unavailable, time conflict, etc."
                            required
                        />
                    </div>
                </div>

                <div className="dialog-actions">
                    <button type="button" className="btn-secondary" onClick={handleCancel}>
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="btn-danger"
                        onClick={handleSubmit}
                        disabled={!reason || reason.trim().length === 0}
                    >
                        Reject Request
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RejectionReasonDialog;