import './App.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import Authentication from './Authentication';


function LandingPage() {
  const [bgLoaded, setBgLoaded] = React.useState(false);
  const bgUrl = process.env.PUBLIC_URL + '/lucid.jpg';
  const orbUrl = process.env.PUBLIC_URL + '/orb.png';
  const logUrl = process.env.PUBLIC_URL + '/vp-pic.png';
  const navigate = useNavigate();
  const goToAuth = () => navigate('/auth');
  return (
    <div className="App landing-bg" style={{ position: 'relative', minHeight: '100vh' }}>
      <div className="landing-bg-img-wrapper">
        <img src={bgUrl}
          alt="background"
          className="landing-bg-img"
          onLoad={() => setBgLoaded(true)}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '60vw',
            height: '120vh',
            objectFit: 'cover',
            zIndex: 0,
            opacity: 0.98,
            transition: 'opacity 0.7s',
          }}
        />
      </div>

      <div style={{ position: 'absolute', top: 0, left: 0, width: '40vw', height: '100vh', zIndex: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
      </div>
    
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(30,30,40,0.18)',
        zIndex: 1,
        pointerEvents: 'none',
      }} />
      <nav className="navbar glass-navbar">
        <div className="navbar-logo" tabIndex={0} role="button">
          <img 
          src={logUrl} 
          alt="VirtualPay Logo" 
          style={{ width: '220px', height: '150px' }} />
        </div>
        <ul className="navbar-links">
          <li><a href="#company">Our Company</a></li>
        </ul>
        <div className="navbar-actions">
          <button className="navbar-btn secondary" onClick={goToAuth}>Log In</button>
          <button className="navbar-btn primary" onClick={goToAuth}>Get Started</button>
        </div>   
      </nav>
      <div style={{ position: 'relative', zIndex: 20, pointerEvents: 'auto' }}>
        <HeroSection loaded={bgLoaded} />
      </div>
      <FeaturesSection />
      <section className="cta-section">
        <div className="cta-row">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Transform Your Organization?</h2>
            <p className="cta-caption">Empower every voice, unlock honest insights, and drive real change with secure, anonymous feedback. Your journey to a thriving workplace starts here.</p>
            <button className="cta-btn" onClick={goToAuth}>Get Started</button>
          </div>
          <img
            src={orbUrl}
            alt="Decorative Orb"
            className="cta-orb"
          />
        </div>
      </section>
      <footer className="footer-glassy">
        <span>© 2026, Virtual Pay Mauritius. Co. Reg.</span>
      </footer>
    </div>
  );
}

export default LandingPage;
