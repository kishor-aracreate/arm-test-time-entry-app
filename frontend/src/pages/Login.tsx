/**
 * Login Page
 * ---------------------------------------------------------------------------
 * User authentication page for logging into the timer app.
 * Includes form validation and error handling.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Button, Input } from '@/components/ui';
import { useAppWithToast } from '@/hooks/useAppWithToast';
import { useAuth } from '@/components/auth/AuthProvider';
import type { LoginCredentials } from '@/store/types';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login, isLoading, error, clearError } = useAppWithToast();
    const { isAuthenticated } = useAuth();

    const [formData, setFormData] = useState<LoginCredentials>({
        email: '',
        password: '',
    });

    const [formErrors, setFormErrors] = useState<Partial<LoginCredentials>>({});

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    // Clear errors when component mounts
    useEffect(() => {
        clearError();
    }, [clearError]);

    const validateForm = (): boolean => {
        const errors: Partial<LoginCredentials> = {};

        // Email validation
        if (!formData.email) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        // Password validation
        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        // Clear field error when user starts typing
        if (formErrors[name as keyof LoginCredentials]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: undefined,
            }));
        }

        // Clear global error
        if (error) {
            clearError();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await login(formData);
            // Navigation will be handled by the useEffect hook
        } catch (err) {
            // Error is handled by the store
            console.error('Login failed:', err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Welcome back
                    </h2>
                    <p className="mt-2 text-sm sm:text-base text-gray-600">
                        Sign in to continue tracking your time
                    </p>
                </div>

                <Card className="shadow-xl">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                            </div>
                        )}

                        <Input
                            label="Email address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            error={formErrors.email}
                            placeholder="Enter your email"
                            autoComplete="email"
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            error={formErrors.password}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            required
                        />

                        <Button
                            type="submit"
                            className="w-full shadow-lg hover:shadow-xl transition-shadow"
                            size="lg"
                            isLoading={isLoading}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link
                                to="/signup"
                                className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Login;