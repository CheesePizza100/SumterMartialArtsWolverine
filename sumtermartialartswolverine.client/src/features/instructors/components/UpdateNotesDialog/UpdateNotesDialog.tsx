import { useState } from 'react';
import './UpdateNotesDialog.css';

interface UpdateNotesDialogProps {
    studentName: string;
    programName: string;
    currentNotes: string;
    onClose: (notes?: string) => void;
}

function UpdateNotesDialog({ studentName, programName, currentNotes, onClose }: UpdateNotesDialogProps) {
    const [notes, setNotes] = useState(currentNotes);

    const handleSave = () => {
        onClose(notes);
    };

    const handleCancel = () => {
        onClose(); // Close without saving
    };

    return (
        <div className="dialog-overlay" onClick={handleCancel}>
            <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
                <h2 className="dialog-title">Update Instructor Notes</h2>

                <div className="dialog-body">
                    <p><strong>Student:</strong> {studentName}</p>
                    <p><strong>Program:</strong> {programName}</p>

                    <div className="form-field">
                        <label htmlFor="notes">Notes</label>
                        <textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={6}
                            placeholder="Enter your notes about this student's progress..."
                        />
                    </div>
                </div>

                <div className="dialog-actions">
                    <button type="button" className="btn-secondary" onClick={handleCancel}>
                        Cancel
                    </button>
                    <button type="button" className="btn-primary" onClick={handleSave}>
                        Save Notes
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UpdateNotesDialog;