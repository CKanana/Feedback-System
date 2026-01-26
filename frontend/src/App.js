
import './App.css';
import logo from './logo.svg';
import { Link } from 'react-router-dom';


function LandingPage() {
  return (
    <div className="App landing-bg">
      <nav className="navbar">
        <div className="navbar-logo" tabIndex={0} role="button">
          <img src={logo} alt="VirtualPay Logo" />
          <span>Virtual<span className="accent">Pay</span></span>
        </div>
        <ul className="navbar-links">
          <li><a href="#dashboard">Dashboard</a></li>
          <li><a href="#posts">Posts</a></li>
          <li><a href="#analytics">Analytics</a></li>
          <li><a href="#departments">Departments</a></li>
          <li><a href="#settings">Settings</a></li>
        </ul>
        <div className="navbar-actions">
          <Link to="/auth">
            <button className="navbar-btn secondary">Log In</button>
          </Link>
          <button className="navbar-btn primary">Get Started</button>
        </div>
      </nav>
      <main className="landing-main">
        <h1 className="landing-title" id="main-title">Welcome to VirtualPay</h1>
        <p className="landing-desc">
          Empowering open, secure, and data-driven organizational dialogue.
        </p>
      </main>
    </div>
  );
}

export default LandingPage;
