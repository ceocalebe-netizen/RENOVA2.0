import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const data = [
    { month: 'Jan', revenue: 12500 },
    { month: 'Feb', revenue: 18200 },
    { month: 'Mar', revenue: 15800 },
    { month: 'Apr', revenue: 22400 },
    { month: 'May', revenue: 28900 },
    { month: 'Jun', revenue: 31200 },
    { month: 'Jul', revenue: 35600 },
    { month: 'Aug', revenue: 38900 },
    { month: 'Sep', revenue: 42300 },
    { month: 'Oct', revenue: 45800 },
    { month: 'Nov', revenue: 48200 },
    { month: 'Dec', revenue: 52400 },
];

export default function RevenueChart() {
    return (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-lg">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-1">Revenue Overview</h3>
                <p className="text-sm text-slate-400">Monthly revenue performance for 2024</p>
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
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#0f172a',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            color: '#fff'
                        }}
                        formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
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
