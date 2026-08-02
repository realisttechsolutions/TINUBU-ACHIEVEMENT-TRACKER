import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

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

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        this.setState({
            error,
            errorInfo,
        });

        // Log error to console in development
        if (process.env.NODE_ENV === "development") {
            console.error("Error caught by ErrorBoundary:", error, errorInfo);
        }

        // Here you could send error to a logging service
        // logErrorToService(error, errorInfo);
    }

    handleReset = (): void => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    handleGoHome = (): void => {
        window.location.href = "/";
    };

    render(): ReactNode {
        if (this.state.hasError) {
            // Custom fallback UI if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-light-purple/30 to-white p-4">
                    <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
                        {/* Error Icon */}
                        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                            <AlertCircle className="w-8 h-8 text-red-600" />
                        </div>

                        {/* Error Message */}
                        <h1 className="text-2xl font-bold text-brand-dark-blue mb-4">
                            Something went wrong
                        </h1>
                        <p className="text-gray-600 mb-6">
                            We're sorry, but something unexpected happened. Please try again or
                            return to the home page.
                        </p>

                        {/* Error Details (Development Only) */}
                        {process.env.NODE_ENV === "development" && this.state.error && (
                            <div className="mb-6 p-4 bg-red-50 rounded-lg text-left overflow-auto max-h-40">
                                <p className="text-sm font-mono text-red-800">
                                    {this.state.error.toString()}
                                </p>
                                {this.state.errorInfo && (
                                    <pre className="text-xs text-red-600 mt-2 whitespace-pre-wrap">
                                        {this.state.errorInfo.componentStack}
                                    </pre>
                                )}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button
                                onClick={this.handleReset}
                                className="flex items-center gap-2 bg-brand-blue hover:bg-brand-purple"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Try Again
                            </Button>
                            <Button
                                onClick={this.handleGoHome}
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                <Home className="w-4 h-4" />
                                Go Home
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
