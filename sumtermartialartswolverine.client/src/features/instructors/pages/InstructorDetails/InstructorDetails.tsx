import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { instructorsService } from "../../services/instructorsService";
import type { Instructor } from "../../models/instructor.model";
import BeltTimeline from "../../components/BeltTimeline/BeltTimeline";
import PrivateLessonDialog from '../../../private-lessons/components/PrivateLessonDialog';
import Toast from '../../../../shared/components/Toast/Toast'
import './InstructorDetails.css';

function InstructorDetails() {
    const [instructor, setInstructor] = useState<Instructor>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        loadInstructor();
    }, [id]);

    const loadInstructor = async () => {
        const instructorId = Number(id);

        if (isNaN(instructorId)) {
            setError('Invalid instructor ID');
            setIsLoading(false);
            return;
        }

        try {
            const data = await instructorsService.getInstructorById(instructorId);
            setInstructor(data);
        } catch (err) {
            console.error('Error loading instructor:', err);
            setError('Failed to load instructor details');
        } finally {
            setIsLoading(false);
        }
    };

    const openPrivateLessonDialog = () => {
        setIsDialogOpen(true);
    };

    const handleDialogClose = (success: boolean) => {
        setIsDialogOpen(false);
        if (success) {
            setShowToast(true);
        }
    };

    if (isLoading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!instructor) {
        return null;
    }

    return (
        <>
            <div className="instructor-details">
                {/* Header / Hero */}
                <div className="hero">
                    <img src={instructor.photoUrl} alt={instructor.name} className="profile-img" />
                    <div className="header-text">
                        <h1>{instructor.name}</h1>
                        <p className="rank">{instructor.rank}</p>
                    </div>
                </div>

                {/* Bio */}
                <section className="bio-section">
                    <h2>About {instructor.name}</h2>
                    <p>{instructor.bio}</p>
                </section>

                {/* Belt Timeline */}
                <BeltTimeline currentRank={instructor.rank} />

                {/* Achievements */}
                {instructor.achievements && instructor.achievements.length > 0 && (
                    <section className="achievements">
                        <h2>Achievements</h2>
                        <ul>
                            {instructor.achievements.map((achievement, index) => (
                                <li key={index}>{achievement}</li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Private Lesson CTA */}
                <div className="private-lesson-box">
                    <button
                        className="btn-primary"
                        onClick={openPrivateLessonDialog}
                    >
                        Book a Private Lesson
                    </button>
                </div>

                <Link to="/about" className="back">? Back to Instructors</Link>
            </div>

            {/* Dialog */}
            {isDialogOpen && instructor && (
                <PrivateLessonDialog
                    instructorId={instructor.id}
                    instructorName={instructor.name}
                    onClose={handleDialogClose}
                />
            )}

            {/* Toast/Snackbar */}
            {showToast && (
                <Toast
                    message="Your private lesson request has been submitted! We'll contact you soon."
                    type="success"
                    duration={5000}
                    onClose={() => setShowToast(false)}
                />
            )}
        </>
    );
}

export default InstructorDetails;