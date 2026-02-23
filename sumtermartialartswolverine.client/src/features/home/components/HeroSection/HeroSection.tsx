import { Link } from 'react-router-dom';
import './HeroSection.css';

function HeroSection() {
    return (
        <section className="hero">
            <div className="hero-inner">
                <h1>Welcome to Sumter Martial Arts</h1>
                <p>Building discipline, confidence, and strength for all ages.</p>
                <Link to="/programs" className="cta">See Programs</Link>
            </div>
        </section>
    );
}

export default HeroSection;