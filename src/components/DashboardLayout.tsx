import { type ReactNode } from 'react';
import { LayoutDashboard, Users, Settings, LogOut, Bell, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

import logo from '../assets/logo-dashboard.png';

interface DashboardLayoutProps {
    children: ReactNode;
    activeView: string;
    onViewChange: (view: string) => void;
}

export default function DashboardLayout({ children, activeView, onViewChange }: DashboardLayoutProps) {
    const { user, signOut } = useAuth();


    const navItems = [
        { id: 'overview', label: 'Painel', icon: LayoutDashboard },
        { id: 'clients', label: 'Clientes', icon: Users },
        { id: 'settings', label: 'Configurações', icon: Settings },
    ];

    return (
        <div className="flex h-screen bg-slate-900 text-white overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col">
                {/* Logo */}
                <div className="border-b border-slate-800 flex justify-center">
                    <img src={logo} alt="Renova Logo" className="h-40 object-contain" />
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeView === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => onViewChange(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <Icon className="h-5 w-5" />
                                <span className="font-medium">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                            <p className="text-xs text-slate-500">Administrador</p>
                        </div>
                    </div>
                    <button
                        onClick={signOut}
                        className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-slate-400 hover:bg-red-600/10 hover:text-red-400 transition-all duration-200"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Sair</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-slate-950/50 backdrop-blur-sm border-b border-slate-800 flex items-center justify-between px-6">
                    <div>
                        <h2 className="text-xl font-semibold text-white">
                            {navItems.find(item => item.id === activeView)?.label || 'Painel'}
                        </h2>
                        <p className="text-xs text-slate-500">Bem-vindo de volta, gerencie seus negócios</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 rounded-lg hover:bg-slate-800 transition-colors">
                            <Bell className="h-5 w-5 text-slate-400" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-auto p-6 bg-slate-900">
                    {children}
                </main>
            </div>
        </div>
    );
}
