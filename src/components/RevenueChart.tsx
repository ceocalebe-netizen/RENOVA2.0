import { useState, useEffect } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const data = [
    { month: 'Jan', revenue: 0 },
    { month: 'Fev', revenue: 0 },
    { month: 'Mar', revenue: 0 },
    { month: 'Abr', revenue: 0 },
    { month: 'Mai', revenue: 0 },
    { month: 'Jun', revenue: 0 },
    { month: 'Jul', revenue: 0 },
    { month: 'Ago', revenue: 0 },
    { month: 'Set', revenue: 0 },
    { month: 'Out', revenue: 0 },
    { month: 'Nov', revenue: 0 },
    { month: 'Dez', revenue: 0 },
];

export default function RevenueChart() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-lg">
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-1">Visão Geral da Receita</h3>
                    <p className="text-sm text-slate-400">Desempenho da receita mensal em 2024</p>
                </div>
                <div className="h-[300px] flex items-center justify-center">
                    <div className="text-slate-500">Carregando gráfico...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-lg">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-1">Visão Geral da Receita</h3>
                <p className="text-sm text-slate-400">Desempenho da receita mensal em 2024</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis
                        dataKey="month"
                        stroke="#64748b"
                        style={{ fontSize: '12px' }}
                    />
                    <YAxis
                        stroke="#64748b"
                        style={{ fontSize: '12px' }}
                        tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#0f172a',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            color: '#fff'
                        }}
                        formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'Receita']}
                    />
                    <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fill="url(#colorRevenue)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
