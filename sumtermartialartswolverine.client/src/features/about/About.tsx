import { useState, useEffect } from 'react';
import type { Instructor } from '../instructors/models/instructor.model';
import { instructorsService } from '../instructors/services/instructorsService';
import InstructorsGrid from '../instructors/components/InstructorsGrid/InstructorsGrid';
import MissionSection from './components/MissionSection';
import './About.css';

function About() {
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>();

    useEffect(() => {
        loadInstructors();
    }, []);

    const loadInstructors = async () => {
        try {
            const data = await instructorsService.getInstructors();
            setInstructors(data);
            setIsLoading(false);
        } catch (err) {
            console.error('Error loading instructors:', err);
            setError('Failed to load instructors');
            setIsLoading(false);
        }
    };

    return (
        <div className="about-container">
            <section className="hero-section">
                <h1>About Us</h1>
                <p className="intro-text">
                    Sumter Martial Arts is dedicated to teaching traditional values while
                    developing modern martial artists of all ages. We believe in discipline,
                    respect, and continuous growth.
                </p>
            </section>

            <MissionSection />

            <section className="instructors-wrapper">
                {isLoading && <div className="loading">Loading instructors...</div>}
                {error && <div className="error">{error}</div>}
                {!isLoading && !error && (
                    <InstructorsGrid
                        instructors={instructors}
                        title="Meet the Instructors"
                    />
                )}
            </section>
        </div>
    );
}

export default About;