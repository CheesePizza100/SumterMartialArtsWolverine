import { useState, useEffect, FormEvent } from 'react';
import { studentService } from '../../services/studentService';
import { StudentProfile as StudentProfileType } from '../../models/student.model';
import './StudentProfile.css';

function StudentProfile() {
    const [profile, setProfile] = useState<StudentProfileType | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        loadProfile();
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

    const updateProfile = async (e: FormEvent) => {
        e.preventDefault();

        if (!profile) return;

        setSaving(true);
        setError('');
        setSuccessMessage('');

        try {
            await studentService.updateMyContactInfo({
                name: profile.name,
                email: profile.email,
                phone: profile.phone
            });

            setSaving(false);
            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setSaving(false);
            setError('Failed to update profile');
            console.error('Error updating profile:', err);
        }
    };

    const handleInputChange = (field: keyof Pick<StudentProfileType, 'name' | 'email' | 'phone'>, value: string) => {
        if (profile) {
            setProfile({ ...profile, [field]: value });
        }
    };

    return (
        <div className="profile-container">
            <h1>My Profile</h1>

            {loading && <div>Loading...</div>}
            {error && <div className="error">{error}</div>}
            {successMessage && <div className="success">{successMessage}</div>}

            {profile && !loading && (
                <form onSubmit={updateProfile}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            id="name"
                            type="text"
                            value={profile.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={profile.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Phone</label>
                        <input
                            id="phone"
                            type="tel"
                            value={profile.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" disabled={saving}>
                        {saving ? 'Saving...' : 'Update Profile'}
                    </button>
                </form>
            )}
        </div>
    );
}

export default StudentProfile;