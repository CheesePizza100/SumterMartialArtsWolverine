import { useState, useMemo } from 'react';
import './EnrollProgramDialog.css';

interface Program {
    id: number;
    name: string;
}

interface EnrollProgramDialogProps {
    studentId: number;
    studentName: string;
    availablePrograms: Program[];
    onClose: (enrollmentData?: { programId: number; programName: string; initialRank: string }) => void;
}

function EnrollProgramDialog({ studentId, studentName, availablePrograms, onClose }: EnrollProgramDialogProps) {
    const [selectedProgramId, setSelectedProgramId] = useState<number>();
    const [initialRank, setInitialRank] = useState('White Belt');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const selectedProgram = useMemo(() => {
        return availablePrograms.find(p => p.id === selectedProgramId);
    }, [availablePrograms, selectedProgramId]);

    const canSubmit = !!(
        selectedProgramId &&
        initialRank.trim() &&
        !isSubmitting
    );

    const handleCancel = () => {
        onClose();
    };

    const handleSubmit = () => {
        if (!canSubmit) return;

        const program = selectedProgram;
        if (!program) return;

        setIsSubmitting(true);
        onClose({
            programId: selectedProgramId!,
            programName: program.name,
            initialRank: initialRank.trim()
        });
    };

    return (
        <div className="dialog-overlay" onClick={handleCancel}>
            <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
                <h2 className="dialog-title">Enroll in Program</h2>

                <div className="dialog-body">
                    <div className="dialog-form">
                        <p className="student-info">
                            Enrolling: <strong>{studentName}</strong>
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
                                {availablePrograms.map((program) => (
                                    <option key={program.id} value={program.id}>
                                        {program.name}
                                    </option>
                                ))}
                            </select>
                            {availablePrograms.length === 0 && (
                                <span className="hint">
                                    No available programs (student may already be enrolled in all programs)
                                </span>
                            )}
                        </div>

                        {/* Initial Rank */}
                        <div className="form-field">
                            <label htmlFor="initialRank">Initial Rank *</label>
                            <input
                                id="initialRank"
                                type="text"
                                value={initialRank}
                                onChange={(e) => setInitialRank(e.target.value)}
                                placeholder="e.g., White Belt, Beginner"
                                required
                            />
                            <span className="hint">The rank the student will start at in this program</span>
                        </div>

                        {/* Info Box */}
                        {selectedProgram && (
                            <div className="info-box">
                                <span>
                                    Enrolling the student will create an event in the event store and allow
                                    them to begin testing for belt progression in <strong>{selectedProgram.name}</strong>.
                                </span>
                            </div>
                        )}
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
                                <span>Enrolling...</span>
                            </>
                        ) : (
                            'Enroll Student'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EnrollProgramDialog;