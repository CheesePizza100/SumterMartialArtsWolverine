import { Link } from 'react-router-dom';
import './FeaturesSection.css';

function FeaturesSection() {
    const features = [
        {
            icon: '??',
            title: 'Expert Instruction',
            description: 'Learn from highly trained instructors with years of experience in traditional martial arts.'
        },
        {
            icon: '???????????',
            title: 'All Ages Welcome',
            description: 'Programs designed for kids, teens, and adults. Everyone can find their path in martial arts.'
        },
        {
            icon: '??',
            title: 'Competition Ready',
            description: 'Advanced training for those looking to compete at local, regional, and national levels.'
        },
        {
            icon: '??',
            title: 'Build Confidence',
            description: 'Develop mental strength, self-discipline, and confidence that extends beyond the dojo.'
        },
        {
            icon: '??',
            title: 'Community Focus',
            description: 'Join a supportive community that values respect, integrity, and personal growth.'
        },
        {
            icon: '??',
            title: 'Flexible Schedule',
            description: 'Multiple class times throughout the week to fit your busy lifestyle.'
        }
    ];

    return (
        <section className="features">
            <h2>Why Choose Us</h2>

            <div className="features-grid">
                {features.map((feature, index) => (
                    <div key={index} className="feature-card">
                        <div className="icon">{feature.icon}</div>
                        <h3>{feature.title}</h3>
                        <p>{feature.description}</p>
                    </div>
                ))}
            </div>

            <div className="cta-section">
                <h2>Ready to Get Started?</h2>
                <p>Join our community of martial artists and begin your journey today.</p>
                <div className="cta-buttons">
                    <Link to="/programs" className="btn-primary">View Programs</Link>
                    <Link to="/about" className="btn-secondary">Meet Our Team</Link>
                </div>
            </div>
        </section>
    );
}

export default FeaturesSection;