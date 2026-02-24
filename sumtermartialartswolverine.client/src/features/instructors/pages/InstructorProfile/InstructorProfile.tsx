import { useState, useEffect } from 'react';
import type { InstructorProfile as InstructorProfileType } from '../../models/instructor.model';
import { instructorsService } from '../../services/instructorsService';
import './InstructorProfile.css';

function InstructorProfile() {
    const [profile, setProfile] = useState<InstructorProfileType | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        setLoading(true);
        setError('');

        try {
            const data = await instructorsService.getMyProfile();
            setProfile(data);
        } catch (err) {
            setError('Failed to load profile');
            console.error('Error loading profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (name: string): string => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <div className="profile-container">
            <h1>My Profile</h1>

            {loading && <div>Loading...</div>}
            {error && <div className="error">{error}</div>}

            {profile && !loading && (
                <div className="profile-content">
                    <div className="profile-card">
                        <div className="profile-header">
                            <div className="avatar">
                                {profile.photoUrl ? (
                                    <img src={profile.photoUrl} alt={profile.name} />
                                ) : (
                                    <div className="avatar-placeholder">
                                        {getInitials(profile.name)}
                                    </div>
                                )}
                            </div>
                            <div className="profile-info">
                                <h2>{profile.name}</h2>
                                <div className="rank-badge">{profile.rank}</div>
                                <p>{profile.email}</p>
                            </div>
                        </div>

                        {profile.bio && (
                            <div className="bio-section">
                                <h3>Bio</h3>
                                <p>{profile.bio}</p>
                            </div>
                        )}
                    </div>

                    <div className="programs-card">
                        <h3>Programs I Teach</h3>
                        {profile.programs.length === 0 ? (
                            <p>Not assigned to any programs yet.</p>
                        ) : (
                            profile.programs.map((program) => (
                                <div key={program.id} className="program-item">
                                    {program.name}
                                </div>
                            ))
                        )}
                    </div>

                    {profile.classSchedule.length > 0 && (
                        <div className="schedule-card">
                            <h3>My Class Schedule</h3>
                            {profile.classSchedule.map((schedule, index) => (
                                <div key={index} className="schedule-item">
                                    <strong>{schedule.daysOfWeek}</strong>
                                    <span>{schedule.startTime} ({schedule.duration})</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default InstructorProfile;