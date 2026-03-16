import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

const AuthLayout = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-0 -left-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-0 -right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]"></div>

            <div className="w-full max-w-md z-10">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
                        STUDIO <span className="text-indigo-500">GRAVITY</span>
                    </h1>
                    <p className="text-slate-400">Manage your business with intelligence</p>
                </div>
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
