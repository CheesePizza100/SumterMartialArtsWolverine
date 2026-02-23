import { useState, useEffect } from 'react';
import { programsService } from '../../services/programsService';
import type { Program, ProgramCategory } from '../../models/program.model';
import { ProgramFilters } from '../../utils/programFilters';
import ProgramFiltersComponent from '../../components/ProgramFilters/ProgramFilters';
import ProgramCard from '../../components/ProgramCard/ProgramCard';
import './ProgramsList.css';

function ProgramsList() {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
    const [currentFilter, setCurrentFilter] = useState<ProgramCategory>('all');

    useEffect(() => {
        loadPrograms();
    }, []);

    const loadPrograms = async () => {
        try {
            const data = await programsService.getPrograms();
            setPrograms(data);
            setFilteredPrograms(data);
        } catch (err) {
            console.error('Error loading programs:', err);
        }
    };

    const handleFilterChange = (filter: ProgramCategory) => {
        setCurrentFilter(filter);
        setFilteredPrograms(ProgramFilters.filterByCategory(programs, filter));
    };

    return (
        <>
            <section className="programs-header">
                <h1>Our Martial Arts Programs</h1>
                <p>Training options for kids, adults, and competitors.</p>
                <ProgramFiltersComponent
                    currentFilter={currentFilter}
                    onFilterChange={handleFilterChange}
                />
            </section>

            <div className="programs-grid">
                {filteredPrograms.map((program) => (
                    <ProgramCard key={program.id} program={program} />
                ))}
            </div>
        </>
    );
}

export default ProgramsList;