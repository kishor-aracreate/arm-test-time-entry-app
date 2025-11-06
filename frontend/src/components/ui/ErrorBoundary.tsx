/**
 * ErrorBoundary Component
 * ---------------------------------------------------------------------------
 * React error boundary to catch and handle JavaScript errors in the component tree.
 * Provides a fallback UI when errors occur and logs errors for debugging.
 */

import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import Button from './Button';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log the error to console and potentially to an error reporting service
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        this.setState({
            error,
            errorInfo
        });

        // In a production app, you would log this to an error reporting service
        // like Sentry, LogRocket, or Bugsnag
    }

    handleReset = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default fallback UI
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                    <div className="max-w-md w-full">
                        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>

                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                Something went wrong
                            </h2>

                            <p className="text-gray-600 mb-6">
                                We're sorry, but something unexpected happened. Please try refreshing the page or contact support if the problem persists.
                            </p>

                            <div className="space-y-3">
                                <Button
                                    onClick={this.handleReset}
                                    className="w-full"
                                >
                                    Try Again
                                </Button>

                                <Button
                                    variant="ghost"
                                    onClick={() => window.location.reload()}
                                    className="w-full"
                                >
                                    Refresh Page
                                </Button>
                            </div>

                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <details className="mt-6 text-left">
                                    <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                                        Error Details (Development)
                                    </summary>
                                    <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono text-gray-800 overflow-auto max-h-40">
                                        <div className="font-semibold mb-2">Error:</div>
                                        <div className="mb-2">{this.state.error.toString()}</div>
                                        {this.state.errorInfo && (
                                            <>
                                                <div className="font-semibold mb-2">Component Stack:</div>
                                                <div>{this.state.errorInfo.componentStack}</div>
                                            </>
                                        )}
                                    </div>
                                </details>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;