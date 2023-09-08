import React, { ErrorInfo, ReactNode } from 'react';
import { ErrorPage } from 'pages';

interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { 
    hasError: false 
  };

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
  }

  handleReset = () => {
    this.setState({ hasError: false });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage handleReset={this.handleReset}/>;
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
