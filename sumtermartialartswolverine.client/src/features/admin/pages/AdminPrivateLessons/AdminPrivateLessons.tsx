import { useState, useEffect } from 'react';
import Toast from '../../../../shared/components/Toast/Toast';
import RejectReasonDialog from '../../components/RejectionReasonDialog/RejectionReasonDialog';
import { adminPrivateLessonsService } from '../../services/privateLessonsService';
import type { PrivateLessonRequest } from '../../models/privateLessonRequest.model';
import './AdminPrivateLessons.css';

type ToastState = { show: boolean; message: string; type: 'success' | 'error' | 'info' };

const TABS = ['Pending', 'Recent', 'All'] as const;
const TAB_FILTERS = ['Pending', 'Recent', 'All'];

function AdminPrivateLessons() {
    const [requests, setRequests] = useState<PrivateLessonRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | undefined>();
    const [activeTab, setActiveTab] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
    const [rejectingRequest, setRejectingRequest] = useState<PrivateLessonRequest | null>(null);
    const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'info' });

    useEffect(() => {
        loadRequests('Pending');
        loadPendingCount();
    }, []);

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setToast({ show: true, message, type });
    };

    // ─── Data Loading ─────────────────────────────────────────────────────────

    const loadRequests = async (filter: string = 'Pending') => {
        setIsLoading(true);
        setError(undefined);
        try {
            const data = await adminPrivateLessonsService.getAllRequests(filter);
            setRequests(data || []);
        } catch (err) {
            console.error('Error loading requests:', err);
            setError('Failed to load requests');
            setRequests([]);
        } finally {
            setIsLoading(false);
        }
    };

    const loadPendingCount = async () => {
        try {
            const data = await adminPrivateLessonsService.getAllRequests('Pending');
            setPendingCount(data.length);
        } catch (err) {
            console.error('Error loading pending count:', err);
        }
    };

    // ─── Actions ──────────────────────────────────────────────────────────────

    const approve = async (request: PrivateLessonRequest) => {
        try {
            const response = await adminPrivateLessonsService.updateStatus(request.id, 'Approved', undefined);
            if (response.success) {
                showToast('Request approved successfully', 'success');
                loadRequests(TAB_FILTERS[activeTab]);
                loadPendingCount();
            } else {
                showToast(response.message || 'Failed to approve request', 'error');
            }
        } catch (err) {
            console.error('Error approving request:', err);
            showToast('Error approving request', 'error');
        }
    };

    const handleRejectSubmit = async (reason: string) => {
        if (!rejectingRequest) return;
        const request = rejectingRequest;
        setRejectingRequest(null);
        try {
            const response = await adminPrivateLessonsService.updateStatus(request.id, 'Rejected', reason);
            if (response.success) {
                showToast('Request rejected', 'info');
                loadRequests(TAB_FILTERS[activeTab]);
                loadPendingCount();
            } else {
                showToast(response.message || 'Failed to reject request', 'error');
            }
        } catch (err) {
            console.error('Error rejecting request:', err);
            showToast('Error rejecting request', 'error');
        }
    };

    // ─── Helpers ──────────────────────────────────────────────────────────────

    const handleTabChange = (index: number) => {
        setActiveTab(index);
        loadRequests(TAB_FILTERS[index]);
    };

    const formatDateTime = (dateStr: string) =>
        new Date(dateStr).toLocaleString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: 'numeric', minute: '2-digit',
        });

    const formatTimeRange = (start: string, end: string) => {
        const s = new Date(start);
        const e = new Date(end);
        return `${s.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${s.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - ${e.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    };

    const getStatusClass = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'chip-pending';
            case 'approved': return 'chip-approved';
            case 'rejected': return 'chip-rejected';
            default: return '';
        }
    };

    const isPending = (request: PrivateLessonRequest) =>
        request.status.toLowerCase() === 'pending';

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <div className="admin-container">
            <h1>Private Lesson Requests</h1>

            {/* Tabs */}
            <div className="tabs">
                {TABS.map((label, i) => (
                    <button
                        key={label}
                        className={`tab-btn ${activeTab === i ? 'active' : ''}`}
                        onClick={() => handleTabChange(i)}
                    >
                        {label}
                        {label === 'Pending' && pendingCount > 0 && (
                            <span className="badge">{pendingCount}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="tab-content">
                {isLoading && (
                    <div className="loading-container">
                        <div className="spinner" />
                        <p>Loading requests...</p>
                    </div>
                )}

                {error && !isLoading && (
                    <div className="error-container">
                        <p>{error}</p>
                        <button className="btn-retry" onClick={() => loadRequests(TAB_FILTERS[activeTab])}>
                            Retry
                        </button>
                    </div>
                )}

                {!isLoading && !error && (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Instructor</th>
                                    <th>Requested Time</th>
                                    <th>Status</th>
                                    <th>Submitted</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map(request => (
                                    <tr key={request.id}>
                                        <td>
                                            <div className="student-info">
                                                <strong>{request.studentName}</strong>
                                                <small>{request.studentEmail}</small>
                                            </div>
                                        </td>
                                        <td>{request.instructorName}</td>
                                        <td>{formatTimeRange(request.requestedStart, request.requestedEnd)}</td>
                                        <td>
                                            <div className="status-cell">
                                                <span className={`chip ${getStatusClass(request.status)}`}>
                                                    {request.status}
                                                </span>
                                                {request.rejectionReason && (
                                                    <span
                                                        className="info-icon"
                                                        title={`Reason: ${request.rejectionReason}`}
                                                    >
                                                        ℹ️
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td>{formatDateTime(request.createdAt)}</td>
                                        <td>
                                            {isPending(request) ? (
                                                <div className="action-buttons">
                                                    <button className="btn-approve" onClick={() => approve(request)}>
                                                        Approve
                                                    </button>
                                                    <button className="btn-reject" onClick={() => setRejectingRequest(request)}>
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="no-actions">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {requests.length === 0 && (
                            <div className="no-data"><p>No private lesson requests found.</p></div>
                        )}
                    </div>
                )}
            </div>

            {/* Reject Dialog */}
            {rejectingRequest && (
                <RejectReasonDialog
                    studentName={rejectingRequest.studentName}
                    onSubmit={handleRejectSubmit}
                    onClose={() => setRejectingRequest(null)}
                />
            )}

            {/* Toast */}
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

export default AdminPrivateLessons;