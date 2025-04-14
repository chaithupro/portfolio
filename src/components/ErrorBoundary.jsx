import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
    
    // If redirectToHome is true, redirect to homepage after a short delay
    if (this.props.redirectToHome) {
      setTimeout(() => {
        window.location.href = '/';
      }, 3000); // 3 second delay before redirect
    }
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || (
        <div className="w-full h-[60vh] flex items-center justify-center">
          <div className="bg-tertiary p-8 rounded-xl text-center max-w-md">
            <h3 className="text-white text-xl mb-2">Something went wrong</h3>
            <p className="text-secondary mb-4">Redirecting to homepage...</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;