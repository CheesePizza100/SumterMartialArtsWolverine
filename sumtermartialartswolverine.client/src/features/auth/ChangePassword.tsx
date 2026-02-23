import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../core/context/AuthContext';
import './ChangePassword.css';

function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { changePassword, getCurrentUser } = useAuth();
    const navigate = useNavigate();

    const isValid = (): boolean => {
        return currentPassword.length > 0 &&
            newPassword.length >= 8 &&
            newPassword === confirmPassword;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isValid()) {
            setError('Please fill in all fields correctly');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await changePassword(currentPassword, newPassword);
            setLoading(false);

            // Get user role and redirect appropriately
            const user = getCurrentUser();
            if (user?.role === 'Admin') {
                navigate('/admin');
            } else if (user?.role === 'Student') {
                navigate('/student');
            } else if (user?.role === 'Instructor') {
                navigate('/instructor/dashboard');
            } else {
                navigate('/home');
            }
        } catch (err: any) {
            setLoading(false);
            setError(err.response?.data?.message || 'Failed to change password. Please check your current password.');
            console.error('Error changing password:', err);
        }
    };

    return (
        <div className="change-password-container">
            <div className="change-password-card">
                <h2>Change Your Password</h2>
                <p className="warning-message">
                    ?? For security reasons, you must change your temporary password before continuing.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="currentPassword">Current Password (Temporary)</label>
                        <input
                            id="currentPassword"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="newPassword">New Password</label>
                        <input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            minLength={8}
                            autoComplete="new-password"
                        />
                        <small>Must be at least 8 characters</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            autoComplete="new-password"
                        />
                    </div>

                    {error && (
                        <div className="error">
                            {error}
                        </div>
                    )}

                    <button type="submit" disabled={loading || !isValid()}>
                        {loading ? 'Changing Password...' : 'Change Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ChangePassword;