import React, { useState } from 'react';
import LoginComponent from './LoginComponent';
import RegisterComponent from './RegisterComponent';

function Login({ onLogin }) {
  const [currentView, setCurrentView] = useState(null);

  const onAuthSuccess = () => {
    setCurrentView('login');
  };

  const renderView = () => {
    switch (currentView) {
      case 'login':
        return <LoginComponent onSuccessfulLogin={onLogin} />;
      case 'register':
        return <RegisterComponent onAuthSuccess={onAuthSuccess} />;
      default:
        return (
          <div>
            <button onClick={() => setCurrentView('login')}>Go to Login</button>
            <button onClick={() => setCurrentView('register')}>Go to Register</button>
          </div>
        );
    }
  };

  return (
    <div>
      {renderView()}
    </div>
  );
}

export default Login;