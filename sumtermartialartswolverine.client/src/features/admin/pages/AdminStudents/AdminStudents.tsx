import { useState, useEffect } from 'react';
import Toast from '../../../../shared/components/Toast/Toast';
import ConfirmDialog from '../../../../shared/components/ConfirmDialog/ConfirmDialog';
import RecordTestDialog from '../../components/RecordTestDialog/RecordTestDialog';
import CreateStudentDialog from '../../components/CreateStudentDialog/CreateStudentDialog';
import EnrollProgramDialog from '../../components/EnrollProgramDialog/EnrollProgramDialog';
import RecordAttendanceDialog from '../../components/RecordAttendanceDialog/RecordAttendanceDialog';
import CreateLoginDialog from '../../components/CreateLoginDialog/CreateLoginDialog';
import { adminStudentsService } from '../../services/studentsService';
import { programsService } from '../../../programs/services/programsService';
import type { Student } from '../../models/student.model';
import './AdminStudents.css';

type ToastState = { show: boolean; message: string; type: 'success' | 'error' | 'info' };

type DialogState =
    | { type: 'none' }
    | { type: 'createStudent' }
    | { type: 'createLogin'; student: Student }
    | { type: 'enrollProgram'; availablePrograms: { id: number; name: string }[] }
    | { type: 'recordTest' }
    | { type: 'recordAttendance' }
    | { type: 'confirmDeactivate' };

function AdminStudents() {
    const [students, setStudents] = useState<Student[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | undefined>();
    const [activeTab, setActiveTab] = useState(0);
    const [dialog, setDialog] = useState<DialogState>({ type: 'none' });
    const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'info' });

    useEffect(() => {
        loadStudents();
    }, []);

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setToast({ show: true, message, type });
    };

    const closeDialog = () => setDialog({ type: 'none' });

    // ??? Data Loading ?????????????????????????????????????????????????????????

    const loadStudents = async () => {
        setIsLoading(true);
        setError(undefined);
        try {
            const data = await adminStudentsService.getAllStudents();
            setStudents(data);
            setFilteredStudents(data);
        } catch (err) {
            console.error('Error loading students:', err);
            setError('Failed to load students. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const refreshSelectedStudent = async (studentId: number) => {
        try {
            const student = await adminStudentsService.getStudentById(studentId);
            setSelectedStudent(student);
        } catch (err) {
            console.error('Error refreshing student:', err);
        }
    };

    // ??? Search ???????????????????????????????????????????????????????????????

    const handleSearchChange = async (term: string) => {
        setSearchTerm(term);
        if (!term.trim()) {
            setFilteredStudents(students);
            return;
        }
        try {
            const results = await adminStudentsService.searchStudents(term);
            setFilteredStudents(results);
        } catch {
            const lower = term.toLowerCase();
            setFilteredStudents(students.filter(s =>
                s.name.toLowerCase().includes(lower) ||
                s.email.toLowerCase().includes(lower) ||
                s.programs.some(p => p.name.toLowerCase().includes(lower))
            ));
        }
    };

    // ??? Selection ????????????????????????????????????????????????????????????

    const selectStudent = (student: Student) => {
        setSelectedStudent(student);
        setActiveTab(0);
    };

    const backToList = () => setSelectedStudent(null);

    // ??? Helpers ??????????????????????????????????????????????????????????????

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const getLastTestDate = (student: Student) =>
        student.testHistory.length === 0 ? 'No tests yet' : formatDate(student.testHistory[0].date);

    const getResultColor = (result: string) =>
        result.toLowerCase() === 'pass' ? 'chip-pass' : 'chip-fail';

    const getTotalAttendance = (student: Student) => {
        const total = student.programs.reduce((sum, p) => sum + p.attendance.total, 0);
        const last30Days = student.programs.reduce((sum, p) => sum + p.attendance.last30Days, 0);
        const rate = student.programs.length > 0
            ? Math.round(student.programs.reduce((sum, p) => sum + p.attendance.attendanceRate, 0) / student.programs.length)
            : 0;
        return { total, last30Days, rate };
    };

    // ??? Actions ??????????????????????????????????????????????????????????????

    const handleCreateStudent = async (studentData: { name: string; email: string; phone: string }) => {
        try {
            await adminStudentsService.createStudent(studentData);
            showToast('Student created successfully!', 'success');
            closeDialog();
            loadStudents();
        } catch (err) {
            console.error('Error creating student:', err);
            showToast('Error creating student', 'error');
        }
    };

    const handleCreateLogin = async (studentId: number, username: string) => {
        const student = dialog.type === 'createLogin' ? dialog.student : null;
        try {
            const result = await adminStudentsService.createStudentLogin(studentId, { username, password: null });
            showToast(
                `Login created for ${student?.name}! Username: ${result.username} — Temporary Password: ${result.temporaryPassword}. An email has been sent to the student.`,
                'success'
            );
            closeDialog();
            loadStudents();
        } catch (err: any) {
            const message = err?.response?.data?.message || 'Failed to create login';
            showToast(message, 'error');
            console.error('Error creating login:', err);
        }
    };

    const handleRecordTest = async (testData: any) => {
        if (!selectedStudent) return;
        try {
            const response = await adminStudentsService.addTestResult(selectedStudent.id, testData);
            if (response.success) {
                showToast('Test result recorded successfully!', 'success');
                closeDialog();
                loadStudents();
                refreshSelectedStudent(selectedStudent.id);
            } else {
                showToast(response.message || 'Failed to record test result', 'error');
            }
        } catch (err) {
            console.error('Error recording test:', err);
            showToast('Error recording test result', 'error');
        }
    };

    const handleEnrollProgram = async (enrollmentData: { programId: number; programName: string; initialRank: string }) => {
        if (!selectedStudent) return;
        try {
            const response = await adminStudentsService.enrollInProgram(selectedStudent.id, enrollmentData);
            if (response.success) {
                showToast(response.message, 'success');
                closeDialog();
                refreshSelectedStudent(selectedStudent.id);
            } else {
                showToast(response.message, 'error');
            }
        } catch (err) {
            console.error('Error enrolling student:', err);
            showToast('Error enrolling student in program', 'error');
        }
    };

    const handleRecordAttendance = async (programId: number, classesAttended: number) => {
        if (!selectedStudent) return;
        try {
            const response = await adminStudentsService.recordAttendance(selectedStudent.id, programId, classesAttended);
            if (response.success) {
                showToast(response.message, 'success');
                closeDialog();
                refreshSelectedStudent(selectedStudent.id);
            } else {
                showToast(response.message, 'error');
            }
        } catch (err) {
            console.error('Error recording attendance:', err);
            showToast('Error recording attendance', 'error');
        }
    };

    const handleDeactivateStudent = async () => {
        if (!selectedStudent) return;
        try {
            const response = await adminStudentsService.deactivateStudent(selectedStudent.id);
            if (response.success) {
                showToast(response.message, 'success');
                closeDialog();
                backToList();
                loadStudents();
            } else {
                showToast(response.message, 'error');
            }
        } catch (err) {
            console.error('Error deactivating student:', err);
            showToast('Error deactivating student', 'error');
        }
    };

    const openEnrollProgramDialog = async () => {
        if (!selectedStudent) return;
        const enrolledIds = selectedStudent.programs.map(p => p.programId);
        try {
            const allPrograms = await programsService.getPrograms();
            const available = allPrograms
                .filter(p => !enrolledIds.includes(p.id))
                .map(p => ({ id: p.id, name: p.name }));
            setDialog({ type: 'enrollProgram', availablePrograms: available });
        } catch (err) {
            console.error('Error loading programs:', err);
            showToast('Error loading available programs', 'error');
        }
    };

    // ??? Render ???????????????????????????????????????????????????????????????

    return (
        <div className="admin-container">

            {/* ?? Student List View ?? */}
            {!selectedStudent && (
                <div>
                    <div className="header-section">
                        <h1>Student Management</h1>
                        <input
                            className="search-field"
                            type="text"
                            placeholder="Name, email, or program"
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />
                        <button className="btn-primary-action" onClick={() => setDialog({ type: 'createStudent' })}>
                            Create Student
                        </button>
                    </div>

                    {isLoading && (
                        <div className="loading-container">
                            <div className="spinner" />
                            <p>Loading students...</p>
                        </div>
                    )}

                    {error && <div className="error-message">{error}</div>}

                    {!isLoading && !error && (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Student</th>
                                        <th>Contact</th>
                                        <th>Programs &amp; Ranks</th>
                                        <th>Attendance</th>
                                        <th>Last Test</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.map(student => (
                                        <tr key={student.id} className="clickable-row" onClick={() => selectStudent(student)}>
                                            <td>
                                                <div className="student-cell">
                                                    <div className="avatar" />
                                                    <strong>{student.name}</strong>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="contact-info">
                                                    <div>{student.email}</div>
                                                    <small>{student.phone}</small>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="programs-cell">
                                                    {student.programs.map(p => (
                                                        <div key={p.programId} className="program-item">
                                                            <strong>{p.name}:</strong>
                                                            <span className="rank">{p.rank}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="attendance-info">
                                                    <div>{getTotalAttendance(student).last30Days} / 30 days</div>
                                                    <small>{getTotalAttendance(student).rate}% rate</small>
                                                </div>
                                            </td>
                                            <td>{getLastTestDate(student)}</td>
                                            <td onClick={(e) => e.stopPropagation()}>
                                                {!student.hasLogin ? (
                                                    <button
                                                        className="btn-create-login"
                                                        onClick={() => setDialog({ type: 'createLogin', student })}
                                                    >
                                                        Create Login
                                                    </button>
                                                ) : (
                                                    <span className="login-status">Login Active</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredStudents.length === 0 && (
                                <div className="no-data"><p>No students found.</p></div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* ?? Student Detail View ?? */}
            {selectedStudent && (
                <div className="student-detail">
                    <div className="back-button-container">
                        <button className="btn-back" onClick={backToList}>? Back to Students</button>
                    </div>

                    <div className="detail-card">
                        {/* Header */}
                        <div className="student-header">
                            <div className="header-left">
                                <div className="avatar-large" />
                                <div className="header-info">
                                    <h2>{selectedStudent.name}</h2>
                                    <p>{selectedStudent.email}</p>
                                    <p>{selectedStudent.phone}</p>
                                </div>
                            </div>
                            <div className="header-right">
                                <div className="stat-label">Total Classes Attended (All Programs)</div>
                                <div className="stat-value">{getTotalAttendance(selectedStudent).total}</div>
                            </div>
                            <div className="header-actions">
                                <button className="btn-accent" onClick={openEnrollProgramDialog}>Enroll in Program</button>
                                <button className="btn-secondary" onClick={() => setDialog({ type: 'recordAttendance' })}>Record Attendance</button>
                                <button className="btn-primary-action" onClick={() => setDialog({ type: 'recordTest' })}>Record Test Result</button>
                                <button className="btn-destructive-text" onClick={() => setDialog({ type: 'confirmDeactivate' })}>Deactivate Student</button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="tabs">
                            {['Programs & Ranks', 'Test History', 'Attendance'].map((label, i) => (
                                <button
                                    key={label}
                                    className={`tab-btn ${activeTab === i ? 'active' : ''}`}
                                    onClick={() => setActiveTab(i)}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        {/* Tab: Programs & Ranks */}
                        {activeTab === 0 && (
                            <div className="tab-content">
                                {selectedStudent.programs.map(program => (
                                    <div key={program.programId} className="program-card">
                                        <div className="program-header">
                                            <div>
                                                <h3>{program.name}</h3>
                                                <p className="current-rank">
                                                    Current Rank: <span className="rank-badge">{program.rank}</span>
                                                </p>
                                            </div>
                                            <div className="program-dates">
                                                <div>Enrolled: {formatDate(program.enrolledDate)}</div>
                                                {program.lastTest && <div>Last Test: {formatDate(program.lastTest)}</div>}
                                            </div>
                                        </div>
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
                                        {program.testNotes && (
                                            <div className="instructor-notes">
                                                <strong>Instructor Notes</strong>
                                                <p>{program.testNotes}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Tab: Test History */}
                        {activeTab === 1 && (
                            <div className="tab-content">
                                {selectedStudent.testHistory.length > 0 ? (
                                    selectedStudent.testHistory.map((test, i) => (
                                        <div key={i} className="test-card">
                                            <div className="test-header">
                                                <div>
                                                    <div className="test-title">
                                                        <h4>{test.program}</h4>
                                                        <span className={`chip ${getResultColor(test.result)}`}>{test.result}</span>
                                                    </div>
                                                    <p>Promoted to: <strong>{test.rank}</strong></p>
                                                </div>
                                                <div className="test-date">{formatDate(test.date)}</div>
                                            </div>
                                            {test.notes && <div className="test-notes">{test.notes}</div>}
                                        </div>
                                    ))
                                ) : (
                                    <div className="empty-state"><p>No test history yet</p></div>
                                )}
                            </div>
                        )}

                        {/* Tab: Attendance */}
                        {activeTab === 2 && (
                            <div className="tab-content">
                                <div className="attendance-stats">
                                    <div className="stat-card blue">
                                        <div className="stat-number">{getTotalAttendance(selectedStudent).last30Days}</div>
                                        <div className="stat-text">Last 30 Days</div>
                                    </div>
                                    <div className="stat-card green">
                                        <div className="stat-number">{getTotalAttendance(selectedStudent).rate}%</div>
                                        <div className="stat-text">Attendance Rate</div>
                                    </div>
                                    <div className="stat-card purple">
                                        <div className="stat-number">{getTotalAttendance(selectedStudent).total}</div>
                                        <div className="stat-text">Total Classes</div>
                                    </div>
                                </div>

                                <div className="attendance-pattern">
                                    <h4>Attendance Pattern</h4>
                                    {[
                                        { label: 'This Week', pct: 80, value: '4/5 days' },
                                        { label: 'Last Week', pct: 100, value: '5/5 days' },
                                        { label: '2 Weeks Ago', pct: 60, value: '3/5 days' },
                                    ].map(row => (
                                        <div key={row.label} className="pattern-row">
                                            <div className="pattern-label">{row.label}</div>
                                            <div className="pattern-bar">
                                                <div className="pattern-fill" style={{ width: `${row.pct}%` }} />
                                            </div>
                                            <div className="pattern-value">{row.value}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="attendance-note">
                                    <span><strong>Note:</strong> Student maintaining excellent attendance. Eligible for upcoming belt test.</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ?? Dialogs ?? */}
            {dialog.type === 'createStudent' && (
                <CreateStudentDialog
                    onSubmit={handleCreateStudent}
                    onClose={closeDialog}
                />
            )}

            {dialog.type === 'createLogin' && (
                <CreateLoginDialog
                    studentName={dialog.student.name}
                    suggestedUsername={dialog.student.email}
                    onSubmit={(username) => handleCreateLogin(dialog.student.id, username)}
                    onClose={closeDialog}
                />
            )}

            {dialog.type === 'recordTest' && selectedStudent && (
                <RecordTestDialog
                    studentId={selectedStudent.id}
                    studentName={selectedStudent.name}
                    programs={selectedStudent.programs.map(p => ({
                        id: p.programId,
                        name: p.name,
                        currentRank: p.rank,
                    }))}
                    onSubmit={handleRecordTest}
                    onClose={closeDialog}
                />
            )}

            {dialog.type === 'enrollProgram' && selectedStudent && (
                <EnrollProgramDialog
                    studentId={selectedStudent.id}
                    studentName={selectedStudent.name}
                    availablePrograms={dialog.availablePrograms}
                    onSubmit={handleEnrollProgram}
                    onClose={closeDialog}
                />
            )}

            {dialog.type === 'recordAttendance' && selectedStudent && (
                <RecordAttendanceDialog
                    studentId={selectedStudent.id}
                    studentName={selectedStudent.name}
                    programs={selectedStudent.programs.map(p => ({
                        programId: p.programId,
                        programName: p.name,
                        currentTotal: p.attendance?.total || 0,
                        currentLast30Days: p.attendance?.last30Days || 0,
                    }))}
                    onSubmit={(result) => handleRecordAttendance(result.programId, result.classesAttended)}
                    onClose={closeDialog}
                />
            )}

            {dialog.type === 'confirmDeactivate' && selectedStudent && (
                <ConfirmDialog
                    title="Deactivate Student"
                    message={`Are you sure you want to deactivate ${selectedStudent.name}? This will deactivate all their program enrollments. You can reactivate them later if needed.`}
                    confirmText="Deactivate"
                    cancelText="Cancel"
                    isDestructive={true}
                    onConfirm={handleDeactivateStudent}
                    onCancel={closeDialog}
                />
            )}

            {/* ?? Toast ?? */}
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(t => ({ ...t, show: false }))}
                />
            )}
        </div>
    );
}

export default AdminStudents;