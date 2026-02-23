import { useState, useMemo } from 'react';
import './RecordAttendanceDialog.css';

interface Program {
    programId: number;
    programName: string;
    currentTotal: number;
    currentLast30Days: number;
}

interface RecordAttendanceDialogProps {
    studentId: number;
    studentName: string;
    programs: Program[];
    onClose: (data?: { programId: number; classesAttended: number }) => void;
}

function RecordAttendanceDialog({ studentId, studentName, programs, onClose }: RecordAttendanceDialogProps) {
    const [selectedProgramId, setSelectedProgramId] = useState<number>();
    const [classesAttended, setClassesAttended] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const selectedProgram = useMemo(() => {
        return programs.find(p => p.programId === selectedProgramId);
    }, [programs, selectedProgramId]);

    const currentTotal = selectedProgram?.currentTotal || 0;
    const currentLast30Days = selectedProgram?.currentLast30Days || 0;
    const newTotal = currentTotal + (classesAttended || 0);
    const newLast30Days = Math.min(currentLast30Days + (classesAttended || 0), 30);

    const canSubmit = !!(
        selectedProgramId &&
        classesAttended &&
        classesAttended > 0 &&
        classesAttended <= 30 &&
        !isSubmitting
    );

    const handleCancel = () => {
        onClose();
    };

    const handleSubmit = () => {
        if (!canSubmit) return;

        setIsSubmitting(true);
        onClose({
            programId: selectedProgramId!,
            classesAttended
        });
    };

    return (
        <div className="dialog-overlay" onClick={handleCancel}>
            <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
                <h2 className="dialog-title">Record Attendance</h2>

                <div className="dialog-body">
                    <div className="dialog-form">
                        <p className="student-info">
                            Recording attendance for: <strong>{studentName}</strong>
                        </p>

                        {/* Program Selection */}
                        <div className="form-field">
                            <label htmlFor="program">Program *</label>
                            <select
                                id="program"
                                value={selectedProgramId || ''}
                                onChange={(e) => setSelectedProgramId(Number(e.target.value))}
                                required
                            >
                                <option value="">Select a program</option>
                                {programs.map((program) => (
                                    <option key={program.programId} value={program.programId}>
                                        {program.programName}
                                    </option>
                                ))}
                            </select>
                            <span className="hint">Select which program to record attendance for</span>
                        </div>

                        {/* Classes Attended */}
                        <div className="form-field">
                            <label htmlFor="classes">Number of Classes Attended *</label>
                            <input
                                id="classes"
                                type="number"
                                min="1"
                                max="30"
                                value={classesAttended}
                                onChange={(e) => setClassesAttended(Number(e.target.value))}
                                required
                            />
                            <span className="hint">Enter the number of classes attended (1-30)</span>
                        </div>

                        {/* Current Stats - ONLY SHOW IF PROGRAM SELECTED */}
                        {selectedProgram && (
                            <div className="stats-container">
                                <div className="stat-item">
                                    <span className="stat-label">Current Total ({selectedProgram.programName}):</span>
                                    <span className="stat-value">{currentTotal} classes</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">Current Last 30 Days:</span>
                                    <span className="stat-value">{currentLast30Days} classes</span>
                                </div>
                            </div>
                        )}

                        {/* New Stats Preview */}
                        {selectedProgram && (
                            <div className="preview-box">
                                <h4>After Recording:</h4>
                                <div className="preview-stats">
                                    <div className="preview-item">
                                        <span className="preview-label">New Total:</span>
                                        <span className="preview-value">{newTotal} classes</span>
                                    </div>
                                    <div className="preview-item">
                                        <span className="preview-label">New Last 30 Days:</span>
                                        <span className="preview-value">{newLast30Days} classes</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Info Box */}
                        <div className="info-box">
                            <span>
                                Recording attendance will create an event in the event store and update
                                the student's attendance statistics.
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
                                <span>Recording...</span>
                            </>
                        ) : (
                            'Record Attendance'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RecordAttendanceDialog;