import './MissionSection.css';

function MissionSection() {
    return (
        <section className="mission-section">
            <h2>Our Mission</h2>
            <p>
                Our mission is to provide high-quality martial arts instruction that fosters
                confidence, physical fitness, and personal development for students of all ages.
            </p>

            <div className="values-grid">
                <div className="value-card">
                    <div className="icon">??</div>
                    <h3>Discipline</h3>
                    <p>Building self-control and dedication through consistent practice</p>
                </div>

                <div className="value-card">
                    <div className="icon">??</div>
                    <h3>Respect</h3>
                    <p>Honoring traditions, instructors, and fellow students</p>
                </div>

                <div className="value-card">
                    <div className="icon">??</div>
                    <h3>Growth</h3>
                    <p>Continuous improvement in technique, character, and mindset</p>
                </div>
            </div>
        </section>
    );
}

export default MissionSection;