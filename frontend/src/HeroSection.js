import React from 'react';

const HeroSection = ({ loaded }) => {
  return (
    <section className="hero-section">
      <div className={`hero-visual bounce-in${loaded ? ' show' : ''}`} style={{ transitionDelay: '0.2s' }}>
        <div className="floating-feed-wrapper">
          <div className="floating-feed">

            {/* Top App Bar */}
            <div className="feed-header">
              <span className="feed-title">Live Feed Preview</span>
              <span className="admin-badge">PREVIEW</span>
            </div>

            {/* Admin Announcement */}
            <div className="feed-post admin-post">
              <p className="post-title">Admin Announcement</p>
              <p className="post-text">
                🎉 NEW FEATURE: Real-time poll results now available!
              </p>

              <div className="feed-replies">
                <div className="reply">Anonymous: Appreciate the transparency.</div>
                <div className="reply">Team member: Will results be shared?</div>
              </div>
            </div>

            {/* Poll Post */}
            <div className="feed-post">
              <p className="post-title">Quick Poll</p>
              <p className="post-text">
                What's your biggest workplace challenge right now?
              </p>

              <div className="poll-options">
                <div className="poll-option active">Communication</div>
                <div className="poll-option">Workload</div>
                <div className="poll-option">Tools & Tech</div>
              </div>

              <p className="shared-answers">47 responses in 2 hours</p>
            </div>

          </div>
        </div>
      </div>

      <div className="hero-content">
        <div className={`hero-text-wrapper bounce-in${loaded ? ' show' : ''}`} style={{ position: 'relative', zIndex: 100 }}>
          <h1 className="hero-headline" style={{ color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
           Welcome to <br />
            <span style={{ 
              background: 'linear-gradient(90deg, #F7941E 0%, #B24592 100%)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent', 
              backgroundClip: 'text', 
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))' 
            }}>VirtualPay Feedback System</span>
          </h1>
          <p className="hero-subheadline" style={{ color: 'rgba(255,255,255,0.95)', textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
            Anonymous Employee Surveys That Get Real Answers.
            <br />
            Make feedback easy, honest, and actionable. No more awkward conversations.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;