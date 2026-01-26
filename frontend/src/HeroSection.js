import React from 'react';

const HeroSection = ({ loaded }) => {
  return (
    <section className="hero-section">
      <div className={`hero-visual bounce-in${loaded ? ' show' : ''}`} style={{ transitionDelay: '0.2s' }}>
        <div className="floating-feed-wrapper">
          <div className="floating-feed">

            {/* Top App Bar */}
            <div className="feed-header">
              <span className="feed-title">Company Feed</span>
              <span className="admin-badge">Admin</span>
            </div>

            {/* Admin Announcement */}
            <div className="feed-post admin-post">
              <p className="post-title">Admin Announcement</p>
              <p className="post-text">
                Quarterly feedback is now open. Share your thoughts anonymously.
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
                How clear were project timelines this month?
              </p>

              <div className="poll-options">
                <div className="poll-option active">Very clear</div>
                <div className="poll-option">Somewhat clear</div>
                <div className="poll-option">Unclear</div>
              </div>

              <p className="shared-answers">12 responses shared</p>
            </div>

          </div>
        </div>
      </div>

      <div className="hero-content">
        <div className={`hero-text-wrapper bounce-in${loaded ? ' show' : ''}`} style={{ position: 'relative', zIndex: 100, color: '#222' }}>
          <h1 className="hero-headline" style={{ color: '#7D1F4B' }}>
           Welcome to <br />
            <span className="text-gradient">VirtualPay Feedback System </span>
          </h1>
          <p className="hero-subheadline" style={{ color: '#F7941E' }}>
            A secure, role-based platform for structured feedback. Transform anonymous insights into data-driven decisions.
          </p>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;