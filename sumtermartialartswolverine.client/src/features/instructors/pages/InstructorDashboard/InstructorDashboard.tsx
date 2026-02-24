import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { InstructorStudent } from '../../models/instructor.model';
import { instructorsService } from '../../services/instructorsService';
import './InstructorDashboard.css';

function InstructorDashboard() {
    const [students, setStudents] = useState<InstructorStudent[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        setLoading(true);
        setError('');

        try {
            const data = await instructorsService.getMyStudents();
            setStudents(data);
        } catch (err) {
            setError('Failed to load students');
            console.error('Error loading students:', err);
        } finally {
            setLoading(false);
        }
    };

    const getTotalAttendance = (student: InstructorStudent): { last30Days: number; rate: number } => {
        const last30Days = student.programs.reduce((sum, p) => sum + p.attendance.last30Days, 0);
        const rate = student.programs.length > 0
            ? Math.round(student.programs.reduce((sum, p) => sum + p.attendance.attendanceRate, 0) / student.programs.length)
            : 0;
        return { last30Days, rate };
    };

    const viewStudent = (studentId: number) => {
        navigate(`/instructor/students/${studentId}`);
    };

    return (
        <div className="dashboard-container">
            <h1>My Students</h1>

            {loading && <div>Loading...</div>}
            {error && <div className="error">{error}</div>}

            {!loading && students.length === 0 && (
                <div className="empty-state">
                    <p>No students enrolled in your programs yet.</p>
                </div>
            )}

            {!loading && students.length > 0 && (
                <div className="students-grid">
                    {students.map((student) => {
                        const attendance = getTotalAttendance(student);

                        return (
                            <div
                                key={student.id}
                                className="student-card"
                                onClick={() => viewStudent(student.id)}
                            >
                                <div className="student-header">
                                    <h3>{student.name}</h3>
                                    <span className="student-count">{student.programs.length} program(s)</span>
                                </div>

                                <div className="student-info">
                                    <div><strong>Email:</strong> {student.email}</div>
                                    <div><strong>Phone:</strong> {student.phone}</div>
                                </div>

                                <div className="programs-list">
                                    {student.programs.map((program) => (
                                        <div key={program.programId} className="program-item">
                                            <strong>{program.programName}:</strong>
                                            <span className="rank">{program.currentRank}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="student-stats">
                                    <div className="stat">
                                        <span className="stat-label">Attendance (30d)</span>
                                        <span className="stat-value">{attendance.last30Days}</span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-label">Rate</span>
                                        <span className="stat-value">{attendance.rate}%</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default InstructorDashboard;