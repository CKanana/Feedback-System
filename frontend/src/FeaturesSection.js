import React from 'react';
import './App.css';

const FeaturesSection = () => (
  <section className="features-section">
    <div className="features-container">
      <h2 className="features-title">Why Choose Our Platform?</h2>
      <div className="features-grid">
        <div className="feature-card glassy">
          <h3>Anonymous Feedback</h3>
          <p>All feedback is completely anonymous, empowering honest and open communication across your organization.</p>
        </div>
        <div className="feature-card glassy">
          <h3>Secure & Private</h3>
          <p>State-of-the-art encryption and privacy controls keep your data safe and confidential at all times.</p>
        </div>
        <div className="feature-card glassy">
          <h3>Tailored Targeting</h3>
          <p>Send feedback requests to specific teams, departments, individuals, or all staff for maximum relevance.</p>
        </div>
      </div>
    </div>
  </section>
);

export default FeaturesSection;