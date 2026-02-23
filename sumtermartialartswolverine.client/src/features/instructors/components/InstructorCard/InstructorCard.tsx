import { useNavigate } from 'react-router-dom';
import type { Instructor } from '../../models/instructor.model';
import './InstructorCard.css';

interface InstructorCardProps {
    instructor: Instructor;
}

function InstructorCard({ instructor }: InstructorCardProps) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/instructors/${instructor.id}`);
    };

    const truncateBio = (bio: string, maxLength: number = 120): string => {
        return bio.length > maxLength ? `${bio.slice(0, maxLength)}...` : bio;
    };

    return (
        <div className="instructor-card" onClick={handleClick}>
            <img
                src={instructor.photoUrl}
                alt={instructor.name}
                className="instructor-photo"
            />
            <div className="instructor-info">
                <h3>{instructor.name}</h3>
                <p className="rank">{instructor.rank}</p>
                <p className="bio">{truncateBio(instructor.bio)}</p>
            </div>
        </div>
    );
}

export default InstructorCard;