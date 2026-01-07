import React, { useState, useEffect } from 'react';
import { X, User, MapPin, Car, Shield } from 'lucide-react';

interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    company: string;
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

interface ClientFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (client: Omit<Client, 'id'>) => void;
    initialData?: Client | null;
}

type TabType = 'personal' | 'address' | 'vehicle' | 'insurance';

export default function ClientFormModal({ isOpen, onClose, onSubmit, initialData }: ClientFormModalProps) {
    const [activeTab, setActiveTab] = useState<TabType>('personal');
    const [formData, setFormData] = useState<Partial<Client>>({});

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({});
        }
        setActiveTab('personal');
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Basic validation
        if (!formData.name) {
            alert('Nome é obrigatório');
            return;
        }
        onSubmit(formData as Omit<Client, 'id'>);
        onClose();
    };

    const handleChange = (field: keyof Client, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const TabButton = ({ id, icon: Icon, label }: { id: TabType, icon: any, label: string }) => (
        <button
            type="button"
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === id
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-700'
                }`}
        >
            <Icon className="h-4 w-4" />
            {label}
        </button>
    );

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-950 border border-slate-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-800 shrink-0">
                    <h3 className="text-xl font-semibold text-white">
                        {initialData ? 'Editar Cadastro de Cliente' : 'Novo Cadastro de Cliente'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                        <X className="h-5 w-5 text-slate-400" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex px-6 border-b border-slate-800 shrink-0 overflow-x-auto">
                    <TabButton id="personal" icon={User} label="Pessoal & Contato" />
                    <TabButton id="address" icon={MapPin} label="Endereço" />
                    <TabButton id="vehicle" icon={Car} label="Dados do Veículo" />
                    <TabButton id="insurance" icon={Shield} label="Detalhes do Seguro" />
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    <form id="client-form" onSubmit={handleSubmit} className="space-y-6">

                        {activeTab === 'personal' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Nome Completo *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name || ''}
                                            onChange={e => handleChange('name', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                                            placeholder="João da Silva"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Data de Nascimento</label>
                                        <input type="date" value={formData.birth_date || ''} onChange={e => handleChange('birth_date', e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">CPF</label>
                                        <input type="text" value={formData.cpf || ''} onChange={e => handleChange('cpf', e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="000.000.000-00" />
                                    </div>
                                    {/* RG Block */}
                                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-400 mb-1.5">RG</label>
                                            <input type="text" value={formData.rg || ''} onChange={e => handleChange('rg', e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-sm text-white focus:ring-1 focus:ring-blue-500 focus:outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-400 mb-1.5">Órgão Emissor</label>
                                            <input type="text" value={formData.rg_issuer || ''} onChange={e => handleChange('rg_issuer', e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-sm text-white focus:ring-1 focus:ring-blue-500 focus:outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-400 mb-1.5">Data de Emissão</label>
                                            <input type="date" value={formData.rg_issue_date || ''} onChange={e => handleChange('rg_issue_date', e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-sm text-white focus:ring-1 focus:ring-blue-500 focus:outline-none" />
                                        </div>
                                    </div>
                                    {/* CNH Block */}
                                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-400 mb-1.5">CNH</label>
                                            <input type="text" value={formData.cnh || ''} onChange={e => handleChange('cnh', e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-sm text-white focus:ring-1 focus:ring-blue-500 focus:outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-400 mb-1.5">Categoria</label>
                                            <input type="text" value={formData.cnh_category || ''} onChange={e => handleChange('cnh_category', e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-sm text-white focus:ring-1 focus:ring-blue-500 focus:outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-400 mb-1.5">Validade</label>
                                            <input type="date" value={formData.cnh_issue_date || ''} onChange={e => handleChange('cnh_issue_date', e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-sm text-white focus:ring-1 focus:ring-blue-500 focus:outline-none" />
                                        </div>
                                    </div>
                                    <div className="col-span-2 h-px bg-slate-800 my-2" />
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">E-mail</label>
                                        <input type="email" value={formData.email || ''} onChange={e => handleChange('email', e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Empresa</label>
                                        <input type="text" value={formData.company || ''} onChange={e => handleChange('company', e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Celular / WhatsApp</label>
                                        <input type="tel" value={formData.phone || ''} onChange={e => handleChange('phone', e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Telefone Fixo</label>
                                        <input type="tel" value={formData.phone_landline || ''} onChange={e => handleChange('phone_landline', e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'address' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div className="md:col-span-4">
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Endereço Completo</label>
                                        <input type="text" value={formData.address_street || ''} onChange={e => handleChange('address_street', e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                    </div>
                                    <div className="md:col-span-1">
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">CEP</label>
                                        <input type="text" value={formData.address_zip || ''} onChange={e => handleChange('address_zip', e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Cidade</label>
                                        <input type="text" value={formData.address_city || ''} onChange={e => handleChange('address_city', e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                    </div>
                                    <div className="md:col-span-1">
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Estado (UF)</label>
                                        <input type="text" value={formData.address_state || ''} onChange={e => handleChange('address_state', e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'vehicle' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Marca</label>
                                        <input type="text" value={formData.vehicle_brand || ''} onChange={e => handleChange('vehicle_brand', e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Modelo</label>
                                        <input type="text" value={formData.vehicle_model || ''} onChange={e => handleChange('vehicle_model', e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Ano Modelo</label>
                                        <input type="text" value={formData.vehicle_year_model || ''} onChange={e => handleChange('vehicle_year_model', e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Placa</label>
                                        <input type="text" value={formData.vehicle_plate || ''} onChange={e => handleChange('vehicle_plate', e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Chassi</label>
                                        <input type="text" value={formData.vehicle_chassis || ''} onChange={e => handleChange('vehicle_chassis', e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Renavam</label>
                                        <input type="text" value={formData.vehicle_renavam || ''} onChange={e => handleChange('vehicle_renavam', e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Combustível</label>
                                        <select value={formData.vehicle_fuel || ''} onChange={e => handleChange('vehicle_fuel', e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
                                            <option value="">Selecione...</option>
                                            <option value="Gasolina">Gasolina</option>
                                            <option value="Alcool">Álcool</option>
                                            <option value="Flex">Flex</option>
                                            <option value="Hibrido">Híbrido</option>
                                            <option value="Eletrico">Elétrico</option>
                                            <option value="Diesel">Diesel</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Código FIPE</label>
                                        <input type="text" value={formData.vehicle_fipe || ''} onChange={e => handleChange('vehicle_fipe', e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Dispositivo de Segurança</label>
                                        <select value={formData.vehicle_security_device || ''} onChange={e => handleChange('vehicle_security_device', e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
                                            <option value="">Selecione...</option>
                                            <option value="None">Nenhum</option>
                                            <option value="Alarme">Alarme</option>
                                            <option value="Rastreador">Rastreador</option>
                                            <option value="Outro">Outro</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center space-x-3 pt-6">
                                        <input
                                            type="checkbox"
                                            id="vehicle_armored"
                                            checked={formData.vehicle_armored || false}
                                            onChange={e => handleChange('vehicle_armored', e.target.checked)}
                                            className="h-5 w-5 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor="vehicle_armored" className="text-sm font-medium text-slate-300">
                                            Veículo Blindado
                                        </label>
                                    </div>
                                    <div className="col-span-full h-px bg-slate-800 my-2" />
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Uso</label>
                                        <select value={formData.vehicle_usage || ''} onChange={e => handleChange('vehicle_usage', e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
                                            <option value="">Selecione...</option>
                                            <option value="Particular">Particular</option>
                                            <option value="Comercial">Comercial</option>
                                            <option value="Taxi">Táxi</option>
                                            <option value="App Pessoas">App Pessoas</option>
                                            <option value="App Entregas">App Entregas</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Condutor Principal</label>
                                        <input type="text" value={formData.vehicle_main_driver || ''} onChange={e => handleChange('vehicle_main_driver', e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Condutor &lt; 25 Anos</label>
                                        <select value={formData.vehicle_driver_under_25 || ''} onChange={e => handleChange('vehicle_driver_under_25', e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
                                            <option value="">Selecione...</option>
                                            <option value="Não">Não</option>
                                            <option value="Feminino">Sim - Mulher/Feminino</option>
                                            <option value="Masculino">Sim - Homem/Masculino</option>
                                            <option value="Ambos">Sim - Ambos</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'insurance' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <label className="block text-sm font-medium text-slate-300">Tipo de Seguro</label>
                                        <div className="flex gap-4">
                                            {['Novo', 'Renovação'].map(type => (
                                                <label key={type} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="insurance_type"
                                                        value={type}
                                                        checked={formData.insurance_type === type}
                                                        onChange={e => handleChange('insurance_type', e.target.value)}
                                                        className="h-4 w-4 text-blue-600 bg-slate-900 border-slate-700 focus:ring-blue-500"
                                                    />
                                                    <span className="text-white">{type}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="md:col-start-1">
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Seguradora Atual</label>
                                        <input type="text" value={formData.current_insurer || ''} onChange={e => handleChange('current_insurer', e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Número da Apólice</label>
                                        <input type="text" value={formData.policy_number || ''} onChange={e => handleChange('policy_number', e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Vigência (Fim)</label>
                                        <input type="date" value={formData.policy_validity || ''} onChange={e => handleChange('policy_validity', e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Código CI</label>
                                        <input type="text" value={formData.ci_code || ''} onChange={e => handleChange('ci_code', e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                    </div>
                                    <div className="md:col-span-2 pt-4">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <input
                                                type="checkbox"
                                                id="has_claims"
                                                checked={formData.has_claims || false}
                                                onChange={e => handleChange('has_claims', e.target.checked)}
                                                className="h-5 w-5 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
                                            />
                                            <label htmlFor="has_claims" className="text-sm font-medium text-slate-300">
                                                Possui Sinistro?
                                            </label>
                                        </div>
                                        {formData.has_claims && (
                                            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Detalhes do Sinistro</label>
                                                <textarea
                                                    rows={3}
                                                    value={formData.claims_details || ''}
                                                    onChange={e => handleChange('claims_details', e.target.value)}
                                                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                    placeholder="Descreva o sinistro..."
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-800 shrink-0 flex justify-end gap-3 bg-slate-950 rounded-b-xl">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium border border-slate-700"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        form="client-form"
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-600/20"
                    >
                        {initialData ? 'Salvar Alterações' : 'Criar Registro'}
                    </button>
                </div>
            </div>
        </div>
    );
}
