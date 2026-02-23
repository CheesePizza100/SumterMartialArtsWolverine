import { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import type { StudentProfile } from '../../models/student.model';
import type { PrivateLessonRequest } from '../../models/student.model';
import './StudentDashboard.css';

function StudentDashboard() {
    const [profile, setProfile] = useState<StudentProfile | null>(null);
    const [privateLessonRequests, setPrivateLessonRequests] = useState<PrivateLessonRequest[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadProfile();
        loadPrivateLessonRequests();
    }, []);

    const loadProfile = async () => {
        setLoading(true);
        setError('');

        try {
            const data = await studentService.getMyProfile();
            setProfile(data);
        } catch (err) {
            setError('Failed to load profile');
            console.error('Error loading profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadPrivateLessonRequests = async () => {
        try {
            const requests = await studentService.getMyPrivateLessonRequests();
            setPrivateLessonRequests(requests);
        } catch (err) {
            console.error('Error loading private lesson requests:', err);
            // Don't show error to user - just fail silently for this optional feature
        }
    };

    const formatDate = (dateStr: string): string => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatDateTime = (dateStr: string): string => {
        return new Date(dateStr).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    };

    const formatTime = (dateStr: string): string => {
        return new Date(dateStr).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit'
        });
    };

    if (loading) return <div className="dashboard-container"><div>Loading...</div></div>;
    if (error) return <div className="dashboard-container"><div className="error">{error}</div></div>;
    if (!profile) return null;

    return (
        <div className="dashboard-container">
            <h1>My Dashboard</h1>

            <div className="dashboard-content">
                {/* Profile Summary */}
                <div className="profile-card">
                    <h2>{profile.name}</h2>
                    <p>{profile.email}</p>
                    <p>{profile.phone}</p>
                </div>

                {/* Programs */}
                <div className="programs-section">
                    <h2>My Programs</h2>
                    {profile.programs.length === 0 ? (
                        <div>
                            <p>You are not enrolled in any programs yet.</p>
                        </div>
                    ) : (
                        profile.programs.map((program) => (
                            <div key={program.programId} className="program-card">
                                <h3>{program.name}</h3>
                                <div className="program-details">
                                    <div><strong>Program:</strong> {program.name}</div>
                                    <div><strong>Current Rank:</strong> {program.rank}</div>
                                    <div><strong>Enrolled:</strong> {formatDate(program.enrolledDate)}</div>
                                    <div><strong>Last Test:</strong> {program.lastTest ? formatDate(program.lastTest) : 'N/A'}</div>
                                    <div><strong>Attendance (Last 30 Days):</strong> {program.attendance.last30Days}</div>
                                    <div><strong>Total Classes:</strong> {program.attendance.total}</div>
                                    <div><strong>Attendance Rate:</strong> {Math.round(program.attendance.attendanceRate)}%</div>
                                </div>
                                {program.testNotes && (
                                    <div className="instructor-notes">
                                        <strong>Instructor Notes:</strong>
                                        <p>{program.testNotes}</p>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Recent Test History */}
                <div className="test-history-section">
                    <h2>Recent Test History</h2>
                    {profile.testHistory.length === 0 ? (
                        <div>
                            <p>No test history yet.</p>
                        </div>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Program</th>
                                    <th>Rank</th>
                                    <th>Result</th>
                                    <th>Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {profile.testHistory.slice(0, 5).map((test, index) => (
                                    <tr key={index}>
                                        <td>{formatDate(test.date)}</td>
                                        <td>{test.program}</td>
                                        <td>{test.rank}</td>
                                        <td className={test.result === 'Pass' ? 'pass' : 'fail'}>
                                            {test.result}
                                        </td>
                                        <td>{test.notes || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Private Lesson Requests */}
                <div className="private-lessons-section">
                    <h2>My Private Lesson Requests</h2>
                    {privateLessonRequests.length === 0 ? (
                        <div>
                            <p>You haven't requested any private lessons yet.</p>
                        </div>
                    ) : (
                        <div className="lesson-requests">
                            {privateLessonRequests.map((request) => (
                                <div
                                    key={request.id}
                                    className={`lesson-request-card ${request.status.toLowerCase()}`}
                                >
                                    <div className="request-header">
                                        <h3>{request.instructorName}</h3>
                                        <span className={`status-badge ${request.status.toLowerCase()}`}>
                                            {request.status}
                                        </span>
                                    </div>
                                    <div className="request-details">
                                        <div>
                                            <strong>Requested Time:</strong> {formatDateTime(request.requestedStart)} - {formatTime(request.requestedEnd)}
                                        </div>
                                        <div><strong>Submitted:</strong> {formatDateTime(request.createdAt)}</div>
                                        {request.notes && (
                                            <div><strong>Your Notes:</strong> {request.notes}</div>
                                        )}
                                        {request.rejectionReason && (
                                            <div className="rejection-reason">
                                                <strong>Rejection Reason:</strong> {request.rejectionReason}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default StudentDashboard;