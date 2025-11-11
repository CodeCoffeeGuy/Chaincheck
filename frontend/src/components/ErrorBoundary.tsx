import { Component, ErrorInfo, ReactNode } from "react";
import "./ErrorBoundary.css";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <div className="error-boundary-icon">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="40" cy="40" r="35" stroke="#FF6B35" strokeWidth="2" strokeDasharray="4 4" opacity="0.3"/>
                <path d="M25 25L55 55M55 25L25 55" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </div>
            <h1>Something Went Wrong</h1>
            <p className="error-boundary-message">
              We're sorry, but something unexpected happened. This error has been logged and we'll look into it.
            </p>
            
            {this.state.error && (
              <div className="error-boundary-details">
                <details>
                  <summary>Error Details</summary>
                  <div className="error-boundary-error">
                    <strong>Error:</strong>
                    <pre>{this.state.error.toString()}</pre>
                    {this.state.errorInfo && (
                      <>
                        <strong>Component Stack:</strong>
                        <pre>{this.state.errorInfo.componentStack}</pre>
                      </>
                    )}
                  </div>
                </details>
              </div>
            )}

            <div className="error-boundary-actions">
              <button onClick={this.handleReset} className="btn btn-primary">
                Go to Home
              </button>
              <button onClick={() => window.location.reload()} className="btn btn-secondary">
                Reload Page
              </button>
            </div>

            <div className="error-boundary-help">
              <p>If this problem persists, please:</p>
              <ul>
                <li>Check your internet connection</li>
                <li>Make sure MetaMask is properly installed and connected</li>
                <li>Try refreshing the page</li>
                <li>
                  Report the issue on{" "}
                  <a
                    href="https://github.com/CodeAndCoffeeGuy/Chaincheck/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

