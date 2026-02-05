import React from 'react';
import Authentication from './Authentication';

const AuthenticationPage = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)'
    }}>
      <Authentication />
    </div>
  );
};

export default AuthenticationPage;
