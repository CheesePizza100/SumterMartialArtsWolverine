import { useMemo } from 'react';
import { BeltRankUtil } from '../../utils/beltRank.util';
import './BeltTimeline.css';

interface BeltTimelineProps {
    currentRank: string;
}

function BeltTimeline({ currentRank }: BeltTimelineProps) {
    const progression = useMemo(() => {
        return BeltRankUtil.getBeltProgression(currentRank);
    }, [currentRank]);

    return (
        <section className="belt-timeline">
            <h2>Belt Progression</h2>
            <div className="timeline">
                {progression.map((item) => (
                    <div key={item.belt} className="belt-step">
                        <div className={`dot ${item.achieved ? 'active' : ''}`}></div>
                        <p className="belt-label">{item.belt}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default BeltTimeline;