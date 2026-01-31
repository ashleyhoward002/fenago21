'use client';

import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';

interface StatCard {
    label: string;
    value: string | number;
    change?: string;
    trend?: 'up' | 'down' | 'neutral';
    color: string;
}

export default function StatsOverview() {
    const [stats, setStats] = useState<StatCard[]>([]);

    useEffect(() => {
        // TODO: Fetch from MongoDB
        setStats([
            { label: 'Games Played', value: 12, color: 'primary' },
            { label: 'PPG', value: '14.3', change: '+2.3', trend: 'up', color: 'success' },
            { label: 'FG%', value: '42%', change: '+3%', trend: 'up', color: 'info' },
            { label: 'RPG', value: '5.2', change: '-0.5', trend: 'down', color: 'warning' },
            { label: 'APG', value: '3.1', change: '+1.2', trend: 'up', color: 'accent' },
            { label: 'FT%', value: '67%', change: '+5%', trend: 'up', color: 'secondary' },
        ]);
    }, []);

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {stats.map((stat, index) => (
                <GlassCard key={index} className="border-0 bg-base-200/50">
                    <div className="">
                        <p className="text-xs font-semibold opacity-70">{stat.label}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        {stat.change && (
                            <div className="flex items-center gap-1 mt-1">
                                <span className={`text-lg ${stat.trend === 'up' ? 'text-success' : stat.trend === 'down' ? 'text-error' : 'text-base-content'}`}>
                                    {stat.trend === 'up' ? '↑' : stat.trend === 'down' ? '↓' : '→'}
                                </span>
                                <span className="text-xs">{stat.change}</span>
                            </div>
                        )}
                    </div>
                </GlassCard>
            ))}
        </div>
    );
}
