/**
 * Layout Component
 * ---------------------------------------------------------------------------
 * Main layout wrapper for the application providing consistent structure
 * across all pages. Includes navigation, user info, and logout functionality.
 * Enhanced with responsive design and mobile-first approach.
 */

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth';
import { useAppWithToast } from '@/hooks/useAppWithToast';
import { Button } from '@/components/ui';
import OfflineIndicator from '@/components/ui/OfflineIndicator';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { logout, isLoading } = useAppWithToast();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigation = [
        {
            name: 'Dashboard',
            href: '#/',
            current: location.pathname === '/' || location.pathname === '/dashboard',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
                </svg>
            )
        },
        {
            name: 'Time Entries',
            href: '#/time-entries',
            current: location.pathname === '/time-entries',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            name: 'Projects',
            href: '#/projects',
            current: location.pathname === '/projects',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            )
        },
    ];

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            // Force navigation even if logout API fails
            navigate('/login');
        }
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Offline Indicator */}
            <OfflineIndicator />

            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo and brand */}
                        <div className="flex items-center">
                            <a
                                href="#/"
                                className="flex items-center space-x-2 text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                </svg>
                                <span className="hidden sm:block">Timer App</span>
                            </a>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex space-x-1">
                            {navigation.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${item.current
                                        ? 'bg-blue-100 text-blue-700 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                        }`}
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </a>
                            ))}
                        </nav>

                        {/* Desktop User Menu */}
                        <div className="hidden md:flex items-center space-x-4">
                            {user && (
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                                        <span className="text-sm font-semibold text-white">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="hidden lg:block">
                                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleLogout}
                                isLoading={isLoading}
                                disabled={isLoading}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                {isLoading ? 'Logging out...' : 'Logout'}
                            </Button>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center space-x-2">
                            {user && (
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                                    <span className="text-sm font-semibold text-white">
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                            <button
                                type="button"
                                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                onClick={toggleMobileMenu}
                            >
                                <span className="sr-only">Open main menu</span>
                                {isMobileMenuOpen ? (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile navigation menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 bg-white">
                        <div className="px-4 py-3 space-y-1">
                            {/* User info on mobile */}
                            {user && (
                                <div className="flex items-center space-x-3 px-3 py-2 mb-3 bg-gray-50 rounded-lg">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                                        <span className="text-sm font-semibold text-white">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                            )}

                            {/* Navigation links */}
                            {navigation.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-colors ${item.current
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                        }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </a>
                            ))}

                            {/* Logout button */}
                            <div className="pt-3 border-t border-gray-200">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start text-gray-600 hover:text-gray-900"
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        handleLogout();
                                    }}
                                    isLoading={isLoading}
                                    disabled={isLoading}
                                >
                                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    {isLoading ? 'Logging out...' : 'Logout'}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Main content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;