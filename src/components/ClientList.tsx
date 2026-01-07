import { useState, useEffect } from 'react';
import { Plus, Search, Mail, Phone, Building2, Loader2, Edit2, Trash2 } from 'lucide-react';
import ClientFormModal from './ClientFormModal';
import { supabase } from '../lib/supabase';

interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    user_id?: string;
}

export default function ClientList() {
    const [clients, setClients] = useState<Client[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingClient, setEditingClient] = useState<Client | null>(null);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setError('Usuário não autenticado');
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('clients')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            setClients(data || []);
        } catch (err: any) {
            console.error('Error fetching clients:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = async (clientData: Omit<Client, 'id'>) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                alert('Você precisa estar logado');
                return;
            }

            if (editingClient) {
                // Update existing client
                const { data, error } = await supabase
                    .from('clients')
                    .update(clientData)
                    .eq('id', editingClient.id)
                    .select()
                    .single();

                if (error) throw error;

                setClients(clients.map(c => c.id === editingClient.id ? data : c));
            } else {
                // Create new client
                const newClient = {
                    ...clientData,
                    user_id: user.id
                };

                const { data, error } = await supabase
                    .from('clients')
                    .insert([newClient])
                    .select()
                    .single();

                if (error) throw error;

                setClients([data, ...clients]);
            }

            setIsModalOpen(false);
            setEditingClient(null);
        } catch (err: any) {
            console.error('Error saving client:', err);
            alert('Failed to save client: ' + err.message);
        }
    };

    const handleDeleteClient = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este cliente?')) return;

        try {
            const { error } = await supabase
                .from('clients')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setClients(clients.filter(client => client.id !== id));
        } catch (err: any) {
            console.error('Error deleting client:', err);
            alert('Failed to delete client: ' + err.message);
        }
    };

    const openAddModal = () => {
        setEditingClient(null);
        setIsModalOpen(true);
    };

    const openEditModal = (client: Client) => {
        setEditingClient(client);
        setIsModalOpen(true);
    };

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Buscar clientes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-600/30"
                >
                    <Plus className="h-5 w-5" />
                    Novo Cliente
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
                    {error}
                </div>
            )}

            {/* Clients Table */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-900/50 border-b border-slate-800">
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Nome
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    E-mail
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Telefone
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Empresa
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredClients.length > 0 ? (
                                filteredClients.map((client) => (
                                    <tr key={client.id} className="hover:bg-slate-900/30 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-semibold">
                                                    {client.name.charAt(0)}
                                                </div>
                                                <span className="ml-3 text-sm font-medium text-white">{client.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-sm text-slate-300">
                                                <Mail className="h-4 w-4 text-slate-500" />
                                                {client.email || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-sm text-slate-300">
                                                <Phone className="h-4 w-4 text-slate-500" />
                                                {client.phone || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-sm text-slate-300">
                                                <Building2 className="h-4 w-4 text-slate-500" />
                                                {client.company || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => openEditModal(client)}
                                                    className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClient(client.id)}
                                                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        {loading ? 'Carregando...' : 'Nenhum cliente encontrado'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <ClientFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={editingClient}
            />
        </div>
    );
}
