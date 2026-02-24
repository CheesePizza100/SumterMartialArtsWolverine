import { useState, useMemo } from 'react';
import './RecordTestDialog.css';

interface Program {
    id: number;
    name: string;
    currentRank: string;
}

interface RecordTestDialogProps {
    studentId: number;
    studentName: string;
    programs: Program[];
    onClose: (data?: any) => void;
}

function RecordTestDialog({ studentName, programs, onClose }: RecordTestDialogProps) {
    const [selectedProgramId, setSelectedProgramId] = useState<number>();
    const [rankTested, setRankTested] = useState('');
    const [result, setResult] = useState<'Pass' | 'Fail'>('Pass');
    const [notes, setNotes] = useState('');
    const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const selectedProgram = useMemo(() => {
        return programs.find(p => p.id === selectedProgramId);
    }, [programs, selectedProgramId]);

    const canSubmit = !!(
        selectedProgramId &&
        rankTested.trim() &&
        notes.trim() &&
        !isSubmitting
    );

    const handleCancel = () => {
        onClose();
    };

    const handleSubmit = () => {
        if (!selectedProgramId || !rankTested.trim() || !notes.trim()) {
            return;
        }

        const program = selectedProgram;
        if (!program) return;

        setIsSubmitting(true);
        onClose({
            programId: selectedProgramId,
            programName: program.name,
            rank: rankTested.trim(),
            result: result,
            notes: notes.trim(),
            testDate: new Date(testDate).toISOString()
        });
    };

    return (
        <div className="dialog-overlay" onClick={handleCancel}>
            <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
                <h2 className="dialog-title">Record Test Result</h2>

                <div className="dialog-body">
                    <div className="dialog-form">
                        <p className="student-info">
                            Recording test for: <strong>{studentName}</strong>
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
                                    <option key={program.id} value={program.id}>
                                        {program.name} (Current: {program.currentRank})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Rank Being Tested */}
                        <div className="form-field">
                            <label htmlFor="rankTested">Rank Being Tested *</label>
                            <input
                                id="rankTested"
                                type="text"
                                value={rankTested}
                                onChange={(e) => setRankTested(e.target.value)}
                                placeholder="e.g., Blue Belt, Stripe 1"
                                required
                            />
                            {selectedProgram && (
                                <span className="hint">Current rank: {selectedProgram.currentRank}</span>
                            )}
                        </div>

                        {/* Test Result */}
                        <div className="form-field">
                            <label htmlFor="result">Result *</label>
                            <select
                                id="result"
                                value={result}
                                onChange={(e) => setResult(e.target.value as 'Pass' | 'Fail')}
                                required
                            >
                                <option value="Pass">Pass</option>
                                <option value="Fail">Fail</option>
                            </select>
                        </div>

                        {/* Test Date */}
                        <div className="form-field">
                            <label htmlFor="testDate">Test Date *</label>
                            <input
                                id="testDate"
                                type="date"
                                value={testDate}
                                onChange={(e) => setTestDate(e.target.value)}
                                required
                            />
                        </div>

                        {/* Instructor Notes */}
                        <div className="form-field">
                            <label htmlFor="notes">Instructor Notes *</label>
                            <textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={4}
                                placeholder="Enter detailed notes about the test performance..."
                                required
                            />
                            <span className="hint">
                                Required - provide feedback on technique, areas of improvement, etc.
                            </span>
                        </div>

                        {/* Event Sourcing Info */}
                        {result === 'Pass' && selectedProgram && (
                            <div className="info-box">
                                <span>
                                    Recording this test will create events in the event store and automatically promote
                                    the student to <strong>{rankTested}</strong> in {selectedProgram.name}.
                                </span>
                            </div>
                        )}

                        {result === 'Fail' && selectedProgram && (
                            <div className="warning-box">
                                <span>
                                    This test result will be recorded in the event store, but the student will
                                    remain at their current rank ({selectedProgram.currentRank}).
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
                                <span>Recording...</span>
                            </>
                        ) : (
                            'Record Test Result'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RecordTestDialog;