
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import DashboardLayout from '../components/DashboardLayout';
import StatsCard from '../components/StatsCard';
import RevenueChart from '../components/RevenueChart';
import ClientList from '../components/ClientList';
import { DollarSign, Users, TrendingUp, FileText, Loader2 } from 'lucide-react';


export default function Dashboard() {
    const [activeView, setActiveView] = useState('overview');
    const [stats, setStats] = useState({
        totalClients: 0,
        activePolicies: 0,
        totalRevenue: 0,
        growthRate: 0
    });
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // 1. Total Clients
            const { count: totalClients, error: countError } = await supabase
                .from('clients')
                .select('*', { count: 'exact', head: true });

            if (countError) throw countError;

            // 2. Active Policies (validity date >= today)
            const today = new Date().toISOString().split('T')[0];
            const { count: activePolicies, error: policiesError } = await supabase
                .from('clients')
                .select('*', { count: 'exact', head: true })
                .gte('policy_validity', today);

            if (policiesError) throw policiesError;

            // 3. Recent Activity (New clients)
            const { data: recentClients, error: activityError } = await supabase
                .from('clients')
                .select('name, created_at')
                .order('created_at', { ascending: false })
                .limit(4);

            if (activityError) throw activityError;

            setStats({
                totalClients: totalClients || 0,
                activePolicies: activePolicies || 0,
                totalRevenue: 0, // No logic for revenue yet
                growthRate: 0 // No logic for growth yet
            });

            const formattedActivity = recentClients?.map(client => {
                const date = new Date(client.created_at);
                const now = new Date();
                const diffTime = Math.abs(now.getTime() - date.getTime());
                const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                let timeString = '';
                if (diffHours < 24) timeString = `${diffHours} horas atrás`;
                else timeString = `${diffDays} dias atrás`;

                return {
                    action: 'Novo cliente registrado',
                    name: client.name,
                    time: timeString
                };
            }) || [];

            setRecentActivity(formattedActivity);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderContent = () => {
        switch (activeView) {
            case 'clients':
                return <ClientList />;
            case 'settings':
                return (
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-8 text-center">
                        <h3 className="text-xl font-semibold text-white mb-2">Configurações</h3>
                        <p className="text-slate-400">Painel de configurações em breve...</p>
                    </div>
                );
            case 'overview':
            default:
                return (
                    <div className="space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatsCard
                                title="Receita Total"
                                value={`R$ ${stats.totalRevenue.toFixed(2)} `}
                                change="0% vs mês passado"
                                icon={DollarSign}
                                trend="up"
                            />
                            <StatsCard
                                title="Total de Clientes"
                                value={stats.totalClients.toString()}
                                change="0% vs mês passado"
                                icon={Users}
                                trend="up"
                            />
                            <StatsCard
                                title="Apólices Ativas"
                                value={stats.activePolicies.toString()}
                                change="0% vs mês passado"
                                icon={FileText}
                                trend="up"
                            />
                            <StatsCard
                                title="Taxa de Crescimento"
                                value={`${stats.growthRate}% `}
                                change="0% vs mês passado"
                                icon={TrendingUp}
                                trend="up"
                            />
                        </div>

                        {/* Revenue Chart */}
                        <RevenueChart />

                        {/* Recent Activity */}
                        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-lg">
                            <h3 className="text-lg font-semibold text-white mb-4">Atividade Recente</h3>
                            <div className="space-y-3">
                                {recentActivity.length > 0 ? (
                                    recentActivity.map((activity, index) => (
                                        <div key={index} className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
                                            <div>
                                                <p className="text-sm text-white font-medium">{activity.action}</p>
                                                <p className="text-xs text-slate-400">{activity.name}</p>
                                            </div>
                                            <span className="text-xs text-slate-500">{activity.time}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-500 text-center py-4">Nenhuma atividade recente.</p>
                                )}
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
