/**
 * Debug Page
 * ---------------------------------------------------------------------------
 * Diagnostic page to check app status
 */

import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui';
import { useAppStore } from '@/store';

const Debug: React.FC = () => {
    const { projects, timeEntries, activeTimer } = useAppStore();
    const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

    useEffect(() => {
        fetch('http://localhost:3000/api/projects', {
            headers: { 'X-User-ID': '1' }
        })
            .then(() => setApiStatus('online'))
            .catch(() => setApiStatus('offline'));
    }, []);

    return (
        <Layout>
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">Debug Information</h1>

                <Card>
                    <h2 className="text-lg font-semibold mb-4">API Status</h2>
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${apiStatus === 'online' ? 'bg-green-500' :
                                    apiStatus === 'offline' ? 'bg-red-500' :
                                        'bg-yellow-500'
                                }`} />
                            <span>Backend API: {apiStatus}</span>
                        </div>
                        <p className="text-sm text-gray-600">
                            Expected: http://localhost:3000/api
                        </p>
                    </div>
                </Card>

                <Card>
                    <h2 className="text-lg font-semibold mb-4">Data Status</h2>
                    <div className="space-y-2">
                        <p>Projects loaded: {projects.length}</p>
                        <p>Time entries loaded: {timeEntries.length}</p>
                        <p>Active timer: {activeTimer ? 'Yes' : 'No'}</p>
                    </div>
                </Card>

                <Card>
                    <h2 className="text-lg font-semibold mb-4">Navigation Test</h2>
                    <p className="mb-4">If you can see this page, routing is working!</p>
                    <div className="space-y-2">
                        <a href="#/dashboard" className="block text-blue-600 hover:underline">
                            → Go to Dashboard
                        </a>
                        <a href="#/projects" className="block text-blue-600 hover:underline">
                            → Go to Projects
                        </a>
                        <a href="#/time-entries" className="block text-blue-600 hover:underline">
                            → Go to Time Entries
                        </a>
                    </div>
                </Card>

                <Card>
                    <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                    <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                            If navbar is not visible, check:
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            <li>Browser console for errors (F12)</li>
                            <li>Backend is running on port 3000</li>
                            <li>Frontend is running on correct port</li>
                            <li>No CSS conflicts or z-index issues</li>
                        </ul>
                    </div>
                </Card>
            </div>
        </Layout>
    );
};

export default Debug;
