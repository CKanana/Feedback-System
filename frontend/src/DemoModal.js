import React, { useState } from 'react';
import './DemoModal.css';

const DemoModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const demoSteps = [
    {
      title: "Create Anonymous Surveys",
      description: "Design custom feedback forms with our intuitive builder. Choose from templates or create from scratch.",
      image: "📝",
      features: ["Drag & drop builder", "Custom question types", "Anonymous by default"]
    },
    {
      title: "Real-time Analytics",
      description: "Watch responses come in live with beautiful dashboards and instant insights.",
      image: "📊",
      features: ["Live response tracking", "Visual analytics", "Export reports"]
    },
    {
      title: "Actionable Insights",
      description: "Turn feedback into action with AI-powered insights and recommendations.",
      image: "🎯",
      features: ["Smart recommendations", "Trend analysis", "Action planning"]
    }
  ];

  if (!isOpen) return null;

  const nextStep = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="demo-modal-overlay" onClick={onClose}>
      <div className="demo-modal" onClick={e => e.stopPropagation()}>
        <button className="demo-close" onClick={onClose}>×</button>
        
        <div className="demo-header">
          <div className="demo-progress">
            {demoSteps.map((_, index) => (
              <div 
                key={index}
                className={`progress-dot ${index <= currentStep ? 'active' : ''}`}
              />
            ))}
          </div>
          <h2 className="demo-title">Product Demo</h2>
        </div>

        <div className="demo-content">
          <div className="demo-visual">
            <div className="demo-icon">{demoSteps[currentStep].image}</div>
          </div>
          
          <div className="demo-info">
            <h3 className="demo-step-title">{demoSteps[currentStep].title}</h3>
            <p className="demo-description">{demoSteps[currentStep].description}</p>
            
            <ul className="demo-features">
              {demoSteps[currentStep].features.map((feature, index) => (
                <li key={index} className="demo-feature">
                  <span className="feature-check">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="demo-actions">
          <button 
            className="demo-btn secondary" 
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            Previous
          </button>
          <span className="demo-step-counter">
            {currentStep + 1} of {demoSteps.length}
          </span>
          <button 
            className="demo-btn primary" 
            onClick={nextStep}
          >
            {currentStep === demoSteps.length - 1 ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoModal;