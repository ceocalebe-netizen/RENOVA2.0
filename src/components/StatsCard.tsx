import { type LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string;
    change: string;
    icon: LucideIcon;
    trend: 'up' | 'down';
}

export default function StatsCard({ title, value, change, icon: Icon, trend }: StatsCardProps) {
    return (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-lg hover:border-blue-500/50 transition-all duration-300">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm text-slate-400 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-white mb-2">{value}</h3>
                    <p className={`text-sm font-medium ${trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {trend === 'up' ? '↑' : '↓'} {change}
                    </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-600/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-blue-400" />
                </div>
            </div>
        </div>
    );
}
