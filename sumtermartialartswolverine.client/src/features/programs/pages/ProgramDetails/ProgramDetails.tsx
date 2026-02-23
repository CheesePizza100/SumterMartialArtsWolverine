import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { programsService } from '../../services/programsService';
import type { Program } from '../../models/program.model';
import EnrollDialog from '../../components/EnrollDialog/EnrollDialog';
import './ProgramDetails.css';

function ProgramDetails() {
    const [program, setProgram] = useState<Program>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>();
    const [showEnrollDialog, setShowEnrollDialog] = useState(false);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        loadProgram();
    }, [id]);

    const loadProgram = async () => {
        const programId = Number(id);

        if (isNaN(programId)) {
            setError('Invalid program ID');
            setIsLoading(false);
            return;
        }

        try {
            const data = await programsService.getProgramById(programId);
            setProgram(data);
        } catch (err) {
            console.error('Error loading program:', err);
            setError('Failed to load program details');
        } finally {
            setIsLoading(false);
        }
    };

    const openEnrollDialog = () => {
        setShowEnrollDialog(true);
    };

    const handleEnrollClose = (enrollmentData?: any) => {
        setShowEnrollDialog(false);
        if (enrollmentData) {
            // TODO: Show success message or redirect
            console.log('Enrollment submitted:', enrollmentData);
        }
    };

    if (isLoading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!program) {
        return null;
    }

    return (
        <>
            <nav className="breadcrumbs">
                <Link to="/programs">Programs</Link> / <span>{program.name}</span>
            </nav>

            <div className="program-details fade-in">
                <header className="details-header">
                    <h1>{program.name}</h1>
                    <p className="age">{program.ageGroup}</p>
                </header>

                <img className="details-banner" src={program.imageUrl} alt={program.name} />

                <section>
                    <h2>About This Program</h2>
                    <p>{program.description}</p>
                    {program.details && <p>{program.details}</p>}
                </section>

                <section className="info-cards">
                    <div className="info-card">
                        <h3>Duration</h3>
                        <p>{program.duration}</p>
                    </div>
                    <div className="info-card">
                        <h3>Schedule</h3>
                        <p>{program.schedule}</p>
                    </div>
                </section>

                {program.instructors && program.instructors.length > 0 && (
                    <section className="instructors">
                        <h2>Your Instructors</h2>
                        <div className="instructor-grid">
                            {program.instructors.map((instructor) => (
                                <div key={instructor.id} className="instructor-card">
                                    <img src={instructor.photoUrl} alt={instructor.name} />
                                    <h3>{instructor.name}</h3>
                                    <p className="rank">{instructor.rank}</p>
                                    <p className="bio">{instructor.bio}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <a className="sticky-cta" onClick={openEnrollDialog}>
                    Enroll Now
                </a>

                <Link to="/programs" className="floating-back">
                    ? Back
                </Link>
            </div>

            {showEnrollDialog && program && (
                <EnrollDialog program={program} onClose={handleEnrollClose} />
            )}
        </>
    );
}

export default ProgramDetails;