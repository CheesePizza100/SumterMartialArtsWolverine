import type { Instructor } from '../../models/instructor.model';
import InstructorCard from '../InstructorCard/InstructorCard';
import './InstructorsGrid.css';

interface InstructorsGridProps {
    instructors: Instructor[];
    showTitle?: boolean;
    title?: string;
}

function InstructorsGrid({
    instructors,
    showTitle = true,
    title = 'Meet Our Instructors'
}: InstructorsGridProps) {
    return (
        <div className="instructors-section">
            {showTitle && <h2>{title}</h2>}
            <div className="instructors-grid">
                {instructors.map((instructor) => (
                    <InstructorCard
                        key={instructor.id}
                        instructor={instructor}
                    />
                ))}
            </div>
        </div>
    );
}

export default InstructorsGrid;