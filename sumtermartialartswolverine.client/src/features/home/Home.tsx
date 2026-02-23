import HeroSection from './components/HeroSection/HeroSection';
import FeaturesSection from './components/FeaturesSection/FeaturesSection';
import './Home.css';

function Home() {
    return (
        <div className="home-container">
            <HeroSection />
            <FeaturesSection />
        </div>
    );
}

export default Home;