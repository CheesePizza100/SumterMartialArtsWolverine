import { useNavigate } from 'react-router-dom';
import type { Program } from '../../models/program.model';
import './ProgramCard.css';

interface ProgramCardProps {
    program: Program;
}

function ProgramCard({ program }: ProgramCardProps) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/programs/${program.id}`);
    };

    return (
        <div className="program-card fade-in" onClick={handleClick}>
            <div className="card-image">
                <img src={program.imageUrl} alt={program.name} />
                <span className="badge">{program.ageGroup}</span>
            </div>
            <div className="card-body">
                <h3>{program.name}</h3>
                <p>{program.description}</p>
            </div>
        </div>
    );
}

export default ProgramCard;