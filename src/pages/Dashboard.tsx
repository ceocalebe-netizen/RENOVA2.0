import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import StatsCard from '../components/StatsCard';
import RevenueChart from '../components/RevenueChart';
import ClientList from '../components/ClientList';
import { DollarSign, Users, TrendingUp, FileText } from 'lucide-react';

export default function Dashboard() {
    const [activeView, setActiveView] = useState('overview');

    const renderContent = () => {
        switch (activeView) {
            case 'clients':
                return <ClientList />;
            case 'settings':
                return (
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-8 text-center">
                        <h3 className="text-xl font-semibold text-white mb-2">Settings</h3>
                        <p className="text-slate-400">Settings panel coming soon...</p>
                    </div>
                );
            case 'overview':
            default:
                return (
                    <div className="space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatsCard
                                title="Total Revenue"
                                value="$52,400"
                                change="12.5% from last month"
                                icon={DollarSign}
                                trend="up"
                            />
                            <StatsCard
                                title="Total Clients"
                                value="248"
                                change="8.2% from last month"
                                icon={Users}
                                trend="up"
                            />
                            <StatsCard
                                title="Active Policies"
                                value="1,842"
                                change="3.1% from last month"
                                icon={FileText}
                                trend="up"
                            />
                            <StatsCard
                                title="Growth Rate"
                                value="23.5%"
                                change="2.4% from last month"
                                icon={TrendingUp}
                                trend="up"
                            />
                        </div>

                        {/* Revenue Chart */}
                        <RevenueChart />

                        {/* Recent Activity */}
                        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-lg">
                            <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                            <div className="space-y-3">
                                {[
                                    { action: 'New client registered', name: 'John Smith', time: '2 hours ago' },
                                    { action: 'Policy renewed', name: 'Sarah Johnson', time: '5 hours ago' },
                                    { action: 'Payment received', name: 'Michael Brown', time: '1 day ago' },
                                    { action: 'New quote requested', name: 'Emily Davis', time: '2 days ago' },
                                ].map((activity, index) => (
                                    <div key={index} className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
                                        <div>
                                            <p className="text-sm text-white font-medium">{activity.action}</p>
                                            <p className="text-xs text-slate-400">{activity.name}</p>
                                        </div>
                                        <span className="text-xs text-slate-500">{activity.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <DashboardLayout activeView={activeView} onViewChange={setActiveView}>
            {renderContent()}
        </DashboardLayout>
    );
}
