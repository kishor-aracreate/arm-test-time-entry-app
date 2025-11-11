import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateToken } from '@/utils/user';

/**
 * Login Page
 * ---------------------------------------------------------------------------
 * Simple login page that generates a JWT token from the backend.
 * In production, this would authenticate with a real backend auth service.
 */
const Login: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Generate a token from the backend
            await generateToken();

            // Redirect to dashboard
            navigate('/dashboard');
        } catch (err) {
            setError('Failed to sign in. Please try again.');
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
                <div>
                    <h2 className="text-center text-3xl font-bold text-gray-900">
                        Time Tracker
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Sign in to continue
                    </p>
                </div>

                <div className="mt-8 space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleLogin}
                        disabled={isLoading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Signing in...' : 'Sign in with Test Account'}
                    </button>

                    <p className="text-xs text-center text-gray-500">
                        Development mode: This generates a JWT token from the backend
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
