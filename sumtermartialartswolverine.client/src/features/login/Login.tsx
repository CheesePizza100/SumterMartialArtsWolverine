import { useState, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../core/context/AuthContext';
import './Login.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const user = await login(username, password);
            setLoading(false);

            // Check if user must change password
            if (user.mustChangePassword) {
                navigate('/change-password');
                return;
            }

            // Get return URL from location state or default based on role
            const returnUrl = location.state?.returnUrl;

            if (returnUrl) {
                navigate(returnUrl, { replace: true });
            } else if (user.role === 'Admin') {
                navigate('/admin');
            } else if (user.role === 'Student') {
                navigate('/student');
            } else if (user.role === 'Instructor') {
                navigate('/instructor/dashboard');
            } else {
                navigate('/home');
            }
        } catch (err) {
            setLoading(false);
            setError('Invalid username or password');
            console.error('Login error:', err);
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                {error && (
                    <div className="error">
                        {error}
                    </div>
                )}
            </form>
        </div>
    );
}

export default Login;