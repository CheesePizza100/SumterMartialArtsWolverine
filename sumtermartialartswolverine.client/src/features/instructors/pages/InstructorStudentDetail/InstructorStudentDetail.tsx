import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { InstructorStudent } from '../../models/instructor.model';
import { instructorsService } from '../../services/instructorsService';
import RecordTestDialog from '../../../admin/components/RecordTestDialog/RecordTestDialog';
import RecordAttendanceDialog from '../../../admin/components/RecordAttendanceDialog/RecordAttendanceDialog';
import UpdateNotesDialog from '../../components/UpdateNotesDialog/UpdateNotesDialog';
import Toast from '../../../../shared/components/Toast/Toast';
import './InstructorStudentDetail.css';

interface ToastState {
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
}

function InstructorStudentDetail() {
    const [student, setStudent] = useState<InstructorStudent | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState(0);
    const [showRecordTestDialog, setShowRecordTestDialog] = useState(false);
    const [showRecordAttendanceDialog, setShowRecordAttendanceDialog] = useState(false);
    const [showUpdateNotesDialog, setShowUpdateNotesDialog] = useState(false);
    const [selectedProgram, setSelectedProgram] = useState<any>(null);
    const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'info' });

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        const studentId = Number(id);
        if (studentId) {
            loadStudent(studentId);
        }
    }, [id]);

    const loadStudent = async (studentId: number) => {
        setLoading(true);
        setError('');

        try {
            const data = await instructorsService.getStudentDetail(studentId);
            setStudent(data);
        } catch (err) {
            setError('Failed to load student details');
            console.error('Error loading student:', err);
        } finally {
            setLoading(false);
        }
    };

    const backToStudents = () => {
        navigate('/instructor/dashboard');
    };

    const formatDate = (dateStr: string): string => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        setToast({ show: true, message, type });
    };

    const openRecordTestDialog = () => {
        setShowRecordTestDialog(true);
    };

    const handleRecordTestClose = async (testData?: any) => {
        setShowRecordTestDialog(false);

        if (testData && student) {
            try {
                const response = await instructorsService.recordTestResult(student.id, testData);
                if (response.success) {
                    showToast('Test result recorded successfully!');
                    loadStudent(student.id);
                } else {
                    showToast(response.message || 'Failed to record test result', 'error');
                }
            } catch (err) {
                console.error('Error recording test:', err);
                showToast('Error recording test result', 'error');
            }
        }
    };

    const openRecordAttendanceDialog = () => {
        setShowRecordAttendanceDialog(true);
    };

    const handleRecordAttendanceClose = async (data?: { programId: number; classesAttended: number }) => {
        setShowRecordAttendanceDialog(false);

        if (data && student) {
            try {
                const response = await instructorsService.recordAttendance(student.id, {
                    programId: data.programId,
                    classesAttended: data.classesAttended
                });
                if (response.success) {
                    showToast(response.message);
                    loadStudent(student.id);
                } else {
                    showToast(response.message, 'error');
                }
            } catch (err) {
                console.error('Error recording attendance:', err);
                showToast('Error recording attendance', 'error');
            }
        }
    };

    const openUpdateNotesDialog = (program: any) => {
        setSelectedProgram(program);
        setShowUpdateNotesDialog(true);
    };

    const handleUpdateNotesClose = async (notes?: string) => {
        setShowUpdateNotesDialog(false);

        if (notes !== undefined && student && selectedProgram) {
            try {
                const response = await instructorsService.updateProgramNotes(
                    student.id,
                    selectedProgram.programId,
                    notes
                );
                if (response.success) {
                    showToast('Notes updated successfully!');
                    loadStudent(student.id);
                } else {
                    showToast(response.message, 'error');
                }
            } catch (err) {
                console.error('Error updating notes:', err);
                showToast('Error updating notes', 'error');
            }
        }
        setSelectedProgram(null);
    };

    const getTotalAttendance = (): { total: number; last30Days: number; rate: number } => {
        if (!student) return { total: 0, last30Days: 0, rate: 0 };

        const total = student.programs.reduce((sum, p) => sum + p.attendance.total, 0);
        const last30Days = student.programs.reduce((sum, p) => sum + p.attendance.last30Days, 0);
        const rate = student.programs.length > 0
            ? Math.round(student.programs.reduce((sum, p) => sum + p.attendance.attendanceRate, 0) / student.programs.length)
            : 0;
        return { total, last30Days, rate };
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!student) return null;

    return (
        <>
            <div className="student-detail-container">
                <div className="back-button-container">
                    <button className="btn-back" onClick={backToStudents}>
                        ? Back to My Students
                    </button>
                </div>

                <div className="detail-card">
                    {/* Student Header */}
                    <div className="student-header">
                        <div className="header-left">
                            <div className="avatar-large"></div>
                            <div className="header-info">
                                <h2>{student.name}</h2>
                                <p>{student.email}</p>
                                <p>{student.phone}</p>
                            </div>
                        </div>
                        <div className="header-right">
                            <div className="stat-label">Total Classes Attended</div>
                            <div className="stat-value">{getTotalAttendance().total}</div>
                        </div>
                        <div className="header-actions">
                            <button className="btn-secondary" onClick={openRecordAttendanceDialog}>
                                Record Attendance
                            </button>
                            <button className="btn-primary" onClick={openRecordTestDialog}>
                                Record Test Result
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="tabs">
                        <div className="tab-headers">
                            <button
                                className={`tab-header ${activeTab === 0 ? 'active' : ''}`}
                                onClick={() => setActiveTab(0)}
                            >
                                Programs & Ranks
                            </button>
                            <button
                                className={`tab-header ${activeTab === 1 ? 'active' : ''}`}
                                onClick={() => setActiveTab(1)}
                            >
                                Test History
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="tab-content">
                            {/* Programs & Ranks Tab */}
                            {activeTab === 0 && (
                                <div>
                                    {student.programs.map((program) => (
                                        <div key={program.programId} className="program-card">
                                            <div className="program-header">
                                                <div>
                                                    <h3>{program.programName}</h3>
                                                    <p className="current-rank">
                                                        Current Rank: <span className="rank-badge">{program.currentRank}</span>
                                                    </p>
                                                </div>
                                                <div className="program-dates">
                                                    <div>Enrolled: {formatDate(program.enrolledDate)}</div>
                                                    {program.lastTestDate && (
                                                        <div>Last Test: {formatDate(program.lastTestDate)}</div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Attendance Section */}
                                            <div className="attendance-section">
                                                <h4>Attendance (This Program)</h4>
                                                <div className="attendance-stats-row">
                                                    <div className="detail-row">
                                                        <span className="detail-label">Last 30 Days</span>
                                                        <span className="detail-value">{program.attendance.last30Days}</span>
                                                    </div>
                                                    <div className="detail-row">
                                                        <span className="detail-label">Total Classes</span>
                                                        <span className="detail-value">{program.attendance.total}</span>
                                                    </div>
                                                    <div className="detail-row">
                                                        <span className="detail-label">Attendance Rate</span>
                                                        <span className="detail-value">{program.attendance.attendanceRate}%</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Instructor Notes */}
                                            <div className="instructor-notes">
                                                <div className="notes-header">
                                                    <strong>Instructor Notes</strong>
                                                    <button className="btn-text" onClick={() => openUpdateNotesDialog(program)}>
                                                        ?? {program.instructorNotes ? 'Edit Notes' : 'Add Notes'}
                                                    </button>
                                                </div>
                                                {program.instructorNotes ? (
                                                    <p>{program.instructorNotes}</p>
                                                ) : (
                                                    <p className="no-notes">No notes yet</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Test History Tab */}
                            {activeTab === 1 && (
                                <div>
                                    {student.testHistory.length > 0 ? (
                                        student.testHistory.map((test, index) => (
                                            <div key={index} className="test-card">
                                                <div className="test-header">
                                                    <div>
                                                        <div className="test-title">
                                                            <h4>{test.program}</h4>
                                                            <span className={`result-badge ${test.result.toLowerCase() === 'pass' ? 'pass' : 'fail'}`}>
                                                                {test.result}
                                                            </span>
                                                        </div>
                                                        <p>Promoted to: <strong>{test.rank}</strong></p>
                                                    </div>
                                                    <div className="test-date">
                                                        {formatDate(test.date)}
                                                    </div>
                                                </div>
                                                {test.notes && (
                                                    <div className="test-notes">{test.notes}</div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="empty-state">
                                            <p>No test history yet</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Dialogs */}
            {showRecordTestDialog && student && (
                <RecordTestDialog
                    studentId={student.id}
                    studentName={student.name}
                    programs={student.programs.map(p => ({
                        id: p.programId,
                        name: p.programName,
                        currentRank: p.currentRank
                    }))}
                    onClose={handleRecordTestClose}
                />
            )}

            {showRecordAttendanceDialog && student && (
                <RecordAttendanceDialog
                    studentId={student.id}
                    studentName={student.name}
                    programs={student.programs.map(p => ({
                        programId: p.programId,
                        programName: p.programName,
                        currentTotal: p.attendance?.total || 0,
                        currentLast30Days: p.attendance?.last30Days || 0
                    }))}
                    onClose={handleRecordAttendanceClose}
                />
            )}

            {showUpdateNotesDialog && selectedProgram && student && (
                <UpdateNotesDialog
                    studentName={student.name}
                    programName={selectedProgram.programName}
                    currentNotes={selectedProgram.instructorNotes || ''}
                    onClose={handleUpdateNotesClose}
                />
            )}

            {/* Toast */}
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            )}
        </>
    );
}

export default InstructorStudentDetail;