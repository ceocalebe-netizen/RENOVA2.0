import { useState, useEffect } from 'react';
import { Plus, Search, Mail, Phone, Building2, Loader2, Edit2, Trash2, ChevronDown, FileText, FileUp } from 'lucide-react';
import ClientFormModal from './ClientFormModal';
import PdfImportModal from './PdfImportModal';
import { supabase } from '../lib/supabase';


interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    user_id?: string;
    // Personal
    birth_date?: string;
    cpf?: string;
    rg?: string;
    rg_issuer?: string;
    rg_issue_date?: string;
    cnh?: string;
    cnh_category?: string;
    cnh_issue_date?: string;
    // Contact
    phone_landline?: string;
    // Address
    address_street?: string;
    address_zip?: string;
    address_city?: string;
    address_state?: string;
    // Vehicle
    vehicle_brand?: string;
    vehicle_model?: string;
    vehicle_year_model?: string;
    vehicle_plate?: string;
    vehicle_chassis?: string;
    vehicle_renavam?: string;
    vehicle_fuel?: string;
    vehicle_fipe?: string;
    vehicle_security_device?: string;
    vehicle_armored?: boolean;
    vehicle_usage?: string;
    vehicle_main_driver?: string;
    vehicle_driver_under_25?: string;
    // Insurance
    insurance_type?: string;
    current_insurer?: string;
    policy_number?: string;
    policy_validity?: string;
    ci_code?: string;
    has_claims?: boolean;
    claims_details?: string;
}


export default function ClientList() {
    const [clients, setClients] = useState<Client[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
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

            if (editingClient && editingClient.id) {
                // Update existing client (only if it has a valid ID)
                const { data, error } = await supabase
                    .from('clients')
                    .update(clientData)
                    .eq('id', editingClient.id)
                    .select()
                    .single();

                if (error) throw error;

                setClients(clients.map(c => c.id === editingClient.id ? data : c));
            } else {
                // Create new client (PDF imports will go here since they have no id)
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

    // Map webhook API response to Client model
    const mapWebhookResponseToClient = (webhookData: any): Partial<Client> => {
        // Helper to convert DD/MM/YYYY to YYYY-MM-DD
        const convertDate = (dateStr: string | undefined): string | undefined => {
            if (!dateStr || dateStr === 'nulo') return undefined;
            const parts = dateStr.split('/');
            if (parts.length === 3) {
                return `${parts[2]}-${parts[1]}-${parts[0]}`; // YYYY-MM-DD
            }
            return undefined;
        };

        // Helper to extract end date from "DD/MM/YYYY a DD/MM/YYYY" format
        const extractEndDate = (dateRange: string | undefined): string | undefined => {
            if (!dateRange || dateRange === 'nulo') return undefined;
            const parts = dateRange.split(' a ');
            if (parts.length === 2) {
                return convertDate(parts[1].trim());
            }
            return undefined;
        };

        // Helper to clean "nulo" values
        const cleanValue = (value: any): string | undefined => {
            if (!value || value === 'nulo') return undefined;
            return String(value).trim();
        };

        // Helper to convert "Sim"/"Não" to boolean
        const toBoolean = (value: string | undefined): boolean | undefined => {
            if (!value || value === 'nulo') return undefined;
            return value.toLowerCase() === 'sim';
        };

        return {
            // Personal
            name: cleanValue(webhookData['NOME COMPLETO']),
            birth_date: convertDate(webhookData['DATA DE NASCIMENTO']),
            cpf: cleanValue(webhookData['CPF']),
            rg: cleanValue(webhookData['RG']),
            rg_issuer: cleanValue(webhookData['ORGÃO EXPEDITOR']),
            rg_issue_date: convertDate(webhookData['DATA DE EXPEDIÇÃO RG']),
            cnh: cleanValue(webhookData['CNH']),
            cnh_category: cleanValue(webhookData['CATEGORIA CNH']),
            cnh_issue_date: convertDate(webhookData['DATA DE EXPEDIÇÃO CNH']),
            // Contact
            email: cleanValue(webhookData['E-MAIL']),
            phone: cleanValue(webhookData['CELULAR']),
            phone_landline: cleanValue(webhookData['FIXO']),
            company: undefined, // Not in webhook response
            // Address
            address_street: cleanValue(webhookData['ENDEREÇO COMPLETO']),
            address_zip: cleanValue(webhookData['CEP']),
            address_city: cleanValue(webhookData['CIDADE']),
            address_state: cleanValue(webhookData['ESTADO']),
            // Vehicle
            vehicle_brand: cleanValue(webhookData['FABRICANTE']),
            vehicle_model: cleanValue(webhookData['VEÍCULO']),
            vehicle_year_model: cleanValue(webhookData['ANO/MODELO']),
            vehicle_plate: cleanValue(webhookData['PLACA']),
            vehicle_chassis: cleanValue(webhookData['CHASSI']),
            vehicle_renavam: cleanValue(webhookData['RENAVAM']),
            vehicle_fuel: cleanValue(webhookData['COMBUSTÍVEL']),
            vehicle_fipe: cleanValue(webhookData['CÓDIGO FIPE']),
            vehicle_security_device: cleanValue(webhookData['DISPOSITIVO']),
            vehicle_armored: toBoolean(webhookData['BLINDADO']),
            vehicle_usage: cleanValue(webhookData['UTILIZAÇÃO']),
            vehicle_main_driver: cleanValue(webhookData['MOTORISTA PRINCIPAL']),
            vehicle_driver_under_25: cleanValue(webhookData['COBERTURA MENORES DE 25 ANOS']),
            // Insurance
            insurance_type: cleanValue(webhookData['TIPO DE SEGURO']),
            current_insurer: cleanValue(webhookData['SEGURADORA ATUAL']),
            policy_number: cleanValue(webhookData['NÚMERO DA APÓLICE']),
            policy_validity: extractEndDate(webhookData['DATA DE VIGÊNCIA']),
            ci_code: cleanValue(webhookData['CÓDIGO DE IDENTIFICAÇÃO / CI']),
            has_claims: toBoolean(webhookData['TEVE SINISTRO']),
            claims_details: cleanValue(webhookData['TIPO DE SINISTRO']),
        };
    };

    const handlePdfUpload = async (file: File) => {
        try {
            const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = error => reject(error);
            });

            const base64Result = await toBase64(file);
            const base64Content = base64Result.split(',')[1];
            const webhookUrl = "https://n8n-n8n-start.kof6cn.easypanel.host/webhook/47001a57-2280-4c1d-a193-fb6491583968";

            console.log('Enviando PDF para webhook...', {
                filename: file.name,
                size: file.size,
                type: file.type
            });

            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    filename: file.name,
                    mimeType: file.type,
                    size: file.size,
                    data: base64Content
                }),
            });

            console.log('Resposta do webhook:', response.status, response.statusText);

            if (!response.ok) {
                const responseText = await response.text();
                console.error('Erro da API:', responseText);
                throw new Error(`Erro ao enviar (${response.status}): ${responseText || response.statusText}`);
            }

            // Parse JSON response (expecting array with 1 element)
            const responseData = await response.json();
            console.log('Dados parseados:', responseData);

            if (Array.isArray(responseData) && responseData.length > 0) {
                const clientData = mapWebhookResponseToClient(responseData[0]);
                console.log('Dados mapeados para Client:', clientData);

                // Remove id and user_id fields that shouldn't come from PDF import
                const { id, user_id, ...cleanClientData } = clientData as any;

                // Set the cleaned data as editingClient for PDF import
                // Modal will treat this as new creation since it has no id
                setEditingClient(cleanClientData as Client);

                // Close PDF modal and open the form modal
                setIsPdfModalOpen(false);
                setIsModalOpen(true);
            } else {
                throw new Error('Resposta do webhook não contém dados válidos.');
            }
        } catch (err: any) {
            console.error('Erro no upload:', err);
            throw new Error(err.message || 'Falha ao enviar arquivo.');
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
                <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-600/30"
                    >
                        <Plus className="h-5 w-5" />
                        Novo Cliente
                        <ChevronDown className={`h-4 w-4 ml-1 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-lg shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200">
                            <div className="p-1">
                                <button
                                    onClick={() => {
                                        openAddModal();
                                        setIsDropdownOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors text-left"
                                >
                                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                        <FileText className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <span className="block font-medium">Manual</span>
                                        <span className="text-xs text-slate-500">Preencher formulário</span>
                                    </div>
                                </button>

                                <button
                                    onClick={() => {
                                        setIsPdfModalOpen(true);
                                        setIsDropdownOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors text-left"
                                >
                                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                                        <FileUp className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <span className="block font-medium">Via PDF</span>
                                        <span className="text-xs text-slate-500">Importar dados (Em breve)</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
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

            <PdfImportModal
                isOpen={isPdfModalOpen}
                onClose={() => setIsPdfModalOpen(false)}
                onUpload={handlePdfUpload}
            />
        </div>
    );
}
