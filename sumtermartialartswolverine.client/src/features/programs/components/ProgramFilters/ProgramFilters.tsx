import type { ProgramCategory } from '../../models/program.model';
import './ProgramFilters.css';

interface ProgramFiltersProps {
    currentFilter: ProgramCategory;
    onFilterChange: (filter: ProgramCategory) => void;
}

function ProgramFilters({ currentFilter, onFilterChange }: ProgramFiltersProps) {
    const filters = [
        { value: 'all' as ProgramCategory, label: 'All' },
        { value: 'kids' as ProgramCategory, label: 'Kids' },
        { value: 'adult' as ProgramCategory, label: 'Adult' },
        { value: 'competition' as ProgramCategory, label: 'Competition' }
    ];

    return (
        <div className="program-filters">
            {filters.map((filter) => (
                <button
                    key={filter.value}
                    className={currentFilter === filter.value ? 'active' : ''}
                    onClick={() => onFilterChange(filter.value)}
                >
                    {filter.label}
                </button>
            ))}
        </div>
    );
}

export default ProgramFilters;