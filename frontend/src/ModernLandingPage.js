import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ModernLanding.css';
import DemoModal from './DemoModal';

const ModernLandingPage = () => {
  const [loaded, setLoaded] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [showDemo, setShowDemo] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setLoaded(true);
  }, []);

  const rotateCarousel = (direction) => {
    if (direction === 'next') {
      setCurrentSlide((prev) => (prev + 1) % 3);
    } else {
      setCurrentSlide((prev) => (prev - 1 + 3) % 3);
    }
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const carousel = document.querySelector('.carousel-wrapper');
    if (carousel) {
      carousel.style.transform = `rotateY(${currentSlide * -120}deg)`;
    }
    
    // Update dots
    const dots = document.querySelectorAll('.carousel-dots .dot');
    const cards = document.querySelectorAll('.step-card');
    
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
    });
    
    cards.forEach((card, index) => {
      card.classList.toggle('active', index === currentSlide);
    });
  }, [currentSlide]);

  const features = [
    {
      icon: "🔒",
      title: "Anonymous & Secure",
      description: "Complete anonymity with enterprise-grade encryption. Your team's honest feedback, protected.",
      color: "#B24592"
    },
    {
      icon: "📊",
      title: "Real-time Analytics",
      description: "Live dashboards and instant insights. Turn feedback into actionable data immediately.",
      color: "#F7941E"
    },
    {
      icon: "🎯",
      title: "Smart Targeting",
      description: "Precision feedback collection. Target specific teams, departments, or individuals effortlessly.",
      color: "#7D1F4B"
    },
    {
      icon: "⚡",
      title: "Instant Deployment",
      description: "Set up in minutes, not hours. Get your feedback system running immediately.",
      color: "#FF6B35"
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "95%", label: "Response Rate" },
    { number: "24/7", label: "Support" },
    { number: "99.9%", label: "Uptime" }
  ];

  return (
    <div className="modern-landing">
      {/* Navigation */}
      <nav className="modern-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <img 
              src={process.env.PUBLIC_URL + '/vp-pic.png'} 
              alt="VirtualPay" 
              className="logo-img stretched"
            />
          </div>
          
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it Works</a>
            <a href="https://virtual-pay.io/" target="_blank" rel="noopener noreferrer">Company</a>
          </div>
          
          <div className="nav-actions">
            <button 
              className="btn-secondary"
              onClick={() => navigate('/auth')}
            >
              Sign In
            </button>
            <button 
              className="btn-primary"
              onClick={() => navigate('/auth')}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className={`hero-content ${loaded ? 'animate-in' : ''}`}>
            <div className="hero-badge">
              <span className="badge-text">🚀 Now with Real-time Analytics</span>
            </div>
            
            <h1 className="hero-title">
              Transform Your Workplace with
              <span className="gradient-text"> Anonymous Feedback</span>
            </h1>
            
            <p className="hero-subtitle">
              The modern feedback platform that gets real answers. Build trust, 
              improve culture, and make data-driven decisions with complete anonymity.
            </p>
            
            <div className="hero-actions">
              <button 
                className="btn-hero-primary"
                onClick={() => navigate('/auth')}
              >
                Start Free Trial
              </button>
              <button className="btn-hero-secondary" onClick={() => setShowDemo(true)}>
                <span>Watch Demo</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
            </div>
            
            <div className="hero-stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className={`hero-visual ${loaded ? 'animate-in' : ''}`}>
            <div className="floating-dashboard">
              <div className="dashboard-header">
                <div className="header-info">
                  <div className="live-indicator">
                    <div className="live-dot"></div>
                    <span>Live Dashboard</span>
                  </div>
                  <div className="dashboard-title">Feedback Analytics</div>
                </div>
              </div>
              
              <div className="dashboard-content">
                <div className="metric-card">
                  <div className="metric-header">
                    <span className="metric-title">Response Rate</span>
                    <span className="metric-trend">↗ +12%</span>
                  </div>
                  <div className="metric-value">94.2%</div>
                  <div className="metric-bar">
                    <div className="metric-fill" style={{width: '94.2%'}}></div>
                  </div>
                </div>
                
                <div className="metric-card">
                  <div className="metric-header">
                    <span className="metric-title">Satisfaction Score</span>
                    <span className="metric-trend positive">↗ +8%</span>
                  </div>
                  <div className="metric-value">8.7/10</div>
                  <div className="satisfaction-dots">
                    {[...Array(10)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`dot ${i < 9 ? 'filled' : ''}`}
                      ></div>
                    ))}
                  </div>
                </div>
                
                <div className="recent-feedback">
                  <div className="feedback-title">Recent Feedback</div>
                  <div className="feedback-item">
                    <div className="feedback-text">"Great improvement in team communication!"</div>
                    <div className="feedback-meta">Anonymous • 2m ago</div>
                  </div>
                  <div className="feedback-item">
                    <div className="feedback-text">"Love the new project management tools"</div>
                    <div className="feedback-meta">Anonymous • 5m ago</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="floating-orbs">
              <div className="orb orb-1"></div>
              <div className="orb orb-2"></div>
              <div className="orb orb-3"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="features-container">
          <div className="section-header">
            <h2 className="section-title">Why Teams Choose VirtualPay</h2>
            <p className="section-subtitle">
              Everything you need to build a feedback-driven culture
            </p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`feature-card ${activeFeature === index ? 'active' : ''}`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="feature-icon" style={{color: feature.color}}>
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <div className="feature-arrow">→</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="how-it-works">
        <div className="how-container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Get started in three simple steps</p>
          </div>
          
          <div className="carousel-container">
            <div className="carousel-wrapper">
              <div className="step-card active">
                <div className="step-number">01</div>
                <h3 className="step-title">Create Your Survey</h3>
                <p className="step-description">
                  Design custom surveys or use our templates. Target specific teams or your entire organization.
                </p>
              </div>
              
              <div className="step-card">
                <div className="step-number">02</div>
                <h3 className="step-title">Collect Responses</h3>
                <p className="step-description">
                  Employees provide honest feedback anonymously. Real-time notifications keep you updated.
                </p>
              </div>
              
              <div className="step-card">
                <div className="step-number">03</div>
                <h3 className="step-title">Analyze & Act</h3>
                <p className="step-description">
                  View insights on your dashboard. Export reports and take action based on data-driven insights.
                </p>
              </div>
            </div>
            
            <div className="carousel-controls">
              <button className="carousel-btn prev" onClick={() => rotateCarousel('prev')}>‹</button>
              <div className="carousel-dots">
                <span className="dot active" onClick={() => goToSlide(0)}></span>
                <span className="dot" onClick={() => goToSlide(1)}></span>
                <span className="dot" onClick={() => goToSlide(2)}></span>
              </div>
              <button className="carousel-btn next" onClick={() => rotateCarousel('next')}>›</button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Transform Your Workplace?</h2>
            <p className="cta-subtitle">
              Join thousands of companies using VirtualPay to build better workplace cultures.
            </p>
            <div className="cta-actions">
              <button 
                className="btn-cta-primary"
                onClick={() => navigate('/auth')}
              >
                Start Your Free Trial
              </button>
              <button 
                className="btn-cta-secondary"
                onClick={() => setShowDemo(true)}
              >
                Schedule a Demo
              </button>
            </div>
            <p className="cta-note">No credit card required • 14-day free trial</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <img 
                src={process.env.PUBLIC_URL + '/vp-pic.png'} 
                alt="VirtualPay" 
                className="footer-logo stretched"
              />
            </div>
            
            <div className="footer-links">
              <a href="https://virtual-pay.io/" target="_blank" rel="noopener noreferrer">
                About Us
              </a>
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
              <a href="#support">Support</a>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2026 VirtualPay. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Demo Modal */}
      <DemoModal isOpen={showDemo} onClose={() => setShowDemo(false)} />
    </div>
  );
};

export default ModernLandingPage;