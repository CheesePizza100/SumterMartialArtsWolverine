import { useState, useEffect } from 'react';
import { adminInstructorsService } from '../../services/instructorsService';
import type { Instructor } from '../../../instructors/models/instructor.model';
import CreateLoginDialog from '../../components/CreateLoginDialog/CreateLoginDialog';
import Toast from '../../../../shared/components/Toast/Toast';
import './AdminInstructors.css';

interface ToastState {
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
}

function AdminInstructors() {
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateLoginDialog, setShowCreateLoginDialog] = useState(false);
    const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
    const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'info' });

    useEffect(() => {
        loadInstructors();
    }, []);

    const loadInstructors = async () => {
        setIsLoading(true);

        try {
            const data = await adminInstructorsService.getAllInstructors();
            setInstructors(data);
        } catch (err) {
            console.error('Error loading instructors:', err);
            showToast('Failed to load instructors', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setToast({ show: true, message, type });
    };

    const createLoginForInstructor = (instructor: Instructor, event: React.MouseEvent) => {
        event.stopPropagation();
        setSelectedInstructor(instructor);
        setShowCreateLoginDialog(true);
    };

    const handleCreateLoginClose = async (username?: string) => {
        setShowCreateLoginDialog(false);

        if (username && selectedInstructor) {
            try {
                const result = await adminInstructorsService.createInstructorLogin(selectedInstructor.id, {
                    username,
                    password: null
                });

                showToast(
                    `Login created for ${selectedInstructor.name}!\nUsername: ${result.username}\nTemporary Password: ${result.temporaryPassword}\n\nAn email has been sent to the instructor.`,
                    'success'
                );

                loadInstructors();
            } catch (err: any) {
                const errorMessage = err.response?.data?.message || 'Failed to create login';
                showToast(errorMessage, 'error');
                console.error('Error creating login:', err);
            }
        }

        setSelectedInstructor(null);
    };

    return (
        <>
            <div className="admin-container">
                <div className="header-section">
                    <h1>Instructor Management</h1>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading instructors...</p>
                    </div>
                )}

                {/* Instructors Table */}
                {!isLoading && (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Instructor</th>
                                    <th>Email</th>
                                    <th>Rank</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {instructors.map((instructor) => (
                                    <tr key={instructor.id}>
                                        <td>
                                            <div className="instructor-cell">
                                                <div className="avatar"></div>
                                                <strong>{instructor.name}</strong>
                                            </div>
                                        </td>
                                        <td>{instructor.email}</td>
                                        <td>
                                            <span className="rank-badge">{instructor.rank}</span>
                                        </td>
                                        <td>
                                            {!instructor.hasLogin ? (
                                                <button
                                                    className="create-login-btn"
                                                    onClick={(e) => createLoginForInstructor(instructor, e)}
                                                >
                                                    Create Login
                                                </button>
                                            ) : (
                                                <span className="login-status">
                                                    <span className="check-icon">?</span>
                                                    Login Active
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {instructors.length === 0 && (
                            <div className="no-data">
                                <p>No instructors found.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Create Login Dialog */}
            {showCreateLoginDialog && selectedInstructor && (
                <CreateLoginDialog
                    name={selectedInstructor.name}
                    suggestedUsername={selectedInstructor.email || ''}
                    onClose={handleCreateLoginClose}
                />
            )}

            {/* Toast */}
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    duration={toast.type === 'success' ? 10000 : 5000}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            )}
        </>
    );
}

export default AdminInstructors;