import React from 'react';
import './card.css';

const Card = React.forwardRef(({ className = '', children, onClick, ...props }, ref) => (
  <div
    ref={ref}
    className={`ui-card ${className} ${onClick ? 'ui-card-clickable' : ''}`}
    onClick={onClick}
    {...props}
  >
    {children}
  </div>
));
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className = '', children, ...props }, ref) => (
  <div
    ref={ref}
    className={`ui-card-header ${className}`}
    {...props}
  >
    {children}
  </div>
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className = '', children, ...props }, ref) => (
  <h3
    ref={ref}
    className={`ui-card-title ${className}`}
    {...props}
  >
    {children}
  </h3>
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className = '', children, ...props }, ref) => (
  <p
    ref={ref}
    className={`ui-card-description ${className}`}
    {...props}
  >
    {children}
  </p>
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({ className = '', children, ...props }, ref) => (
  <div 
    ref={ref} 
    className={`ui-card-content ${className}`} 
    {...props}
  >
    {children}
  </div>
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({ className = '', children, ...props }, ref) => (
  <div
    ref={ref}
    className={`ui-card-footer ${className}`}
    {...props}
  >
    {children}
  </div>
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };