import { useState } from 'react';
import './CreateLoginDialog.css';

interface CreateLoginDialogProps {
    name: string;
    suggestedUsername: string;
    onClose: (username?: string) => void;
}

function CreateLoginDialog({ name, suggestedUsername, onClose }: CreateLoginDialogProps) {
    const [username, setUsername] = useState(suggestedUsername);

    const handleCancel = () => {
        onClose();
    };

    const handleCreate = () => {
        if (username.trim()) {
            onClose(username.trim());
        }
    };

    return (
        <div className="dialog-overlay" onClick={handleCancel}>
            <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
                <h2 className="dialog-title">Create Student Login</h2>

                <div className="dialog-body">
                    <p>Creating login for: <strong>{name}</strong></p>

                    <div className="form-field">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            required
                            autoComplete="off"
                        />
                        <span className="hint">Student will use this to log in</span>
                    </div>

                    <div className="info-box">
                        <strong>?? Automatic Email</strong>
                        <p>The student will receive an email with their username and temporary password.</p>
                    </div>
                </div>

                <div className="dialog-actions">
                    <button type="button" className="btn-secondary" onClick={handleCancel}>
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="btn-primary"
                        onClick={handleCreate}
                        disabled={!username.trim()}
                    >
                        Create Login
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateLoginDialog;