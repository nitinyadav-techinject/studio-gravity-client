import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const Card = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <div className={cn('glass-card p-6 rounded-2xl', className)}>
        {children}
    </div>
);

const CardHeader = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <div className={cn('mb-4', className)}>
        {children}
    </div>
);

const CardTitle = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <h3 className={cn('text-xl font-bold text-white', className)}>
        {children}
    </h3>
);

const CardDescription = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <p className={cn('text-sm text-slate-400', className)}>
        {children}
    </p>
);

const CardContent = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <div className={cn('', className)}>
        {children}
    </div>
);

const CardFooter = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <div className={cn('mt-6 pt-6 border-t border-white/5', className)}>
        {children}
    </div>
);

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
