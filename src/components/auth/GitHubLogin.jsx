import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { styles } from '../../styles';

const GitHubLogin = () => {
  const { 
    loginWithRedirect, 
    logout, 
    isAuthenticated, 
    user, 
    isLoading 
  } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect({
      connection: 'github'
    });
  };

  const handleLogout = () => {
    logout({ 
      returnTo: window.location.origin 
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      {isAuthenticated ? (
        <div className="flex items-center gap-2">
          {user?.picture && (
            <img 
              src={user.picture} 
              alt="GitHub Profile" 
              className="w-8 h-8 rounded-full" 
            />
          )}
          <span className="text-white text-sm">{user?.name || user?.email}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={handleLogin}
          className="px-4 py-1.5 text-sm flex items-center gap-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          Sign in with GitHub
        </button>
      )}
    </div>
  );
};

export default GitHubLogin; 