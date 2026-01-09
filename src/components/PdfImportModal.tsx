import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, FileText, AlertCircle } from 'lucide-react';

interface PdfImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (file: File) => Promise<void>;
}

export default function PdfImportModal({ isOpen, onClose, onUpload }: PdfImportModalProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const validateFile = (file: File) => {
        if (file.type !== 'application/pdf') {
            setError('Por favor, selecione apenas arquivos PDF.');
            return false;
        }
        setError(null);
        return true;
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (validateFile(file)) {
                setSelectedFile(file);
            }
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (validateFile(file)) {
                setSelectedFile(file);
            }
        }
    };

    const handleUploadClick = async () => {
        if (!selectedFile) return;

        try {
            setUploading(true);
            await onUpload(selectedFile);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Erro ao importar arquivo');
        } finally {
            setUploading(false);
        }
    };

    const modalContent = (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div
                className="bg-slate-950 border border-slate-800 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col animate-in fade-in duration-200 zoom-in-95"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                    <h3 className="text-xl font-semibold text-white">
                        Importar Cliente via PDF
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
                        disabled={uploading}
                    >
                        <X className="h-5 w-5 text-slate-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8">
                    {uploading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="relative mb-6">
                                <div className="w-20 h-20 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <FileText className="h-8 w-8 text-blue-500" />
                                </div>
                            </div>
                            <h4 className="text-xl font-semibold text-white mb-2">Processando PDF</h4>
                            <p className="text-slate-400 text-center mb-4">
                                Extraindo informações do documento...
                            </p>
                            <div className="flex flex-col gap-2 text-sm text-slate-500">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                    <span>Enviando arquivo</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-150"></div>
                                    <span>Analisando conteúdo</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-300"></div>
                                    <span>Preparando dados</span>
                                </div>
                            </div>
                        </div>
                    ) : !selectedFile ? (
                        <div
                            onDragEnter={handleDragEnter}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`
                                border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all
                                ${isDragging
                                    ? 'border-blue-500 bg-blue-500/10'
                                    : 'border-slate-700 hover:border-blue-500/50 hover:bg-slate-900'
                                }
                            `}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                accept=".pdf"
                                className="hidden"
                            />
                            <div className="p-4 bg-slate-900 rounded-full mb-4">
                                <Upload className={`h-8 w-8 ${isDragging ? 'text-blue-500' : 'text-slate-400'}`} />
                            </div>
                            <p className="text-lg font-medium text-white mb-2">
                                Clique ou arraste seu arquivo aqui
                            </p>
                            <p className="text-sm text-slate-400">
                                Suportado apenas arquivos PDF
                            </p>
                        </div>
                    ) : (
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-red-500/10 rounded-lg">
                                    <FileText className="h-8 w-8 text-red-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-medium truncate">
                                        {selectedFile.name}
                                    </p>
                                    <p className="text-slate-400 text-sm">
                                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedFile(null);
                                    }}
                                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <button
                                onClick={handleUploadClick}
                                disabled={uploading}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Upload className="h-5 w-5" />
                                Confirmar Importação
                            </button>
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-500">
                            <AlertCircle className="h-5 w-5 shrink-0" />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return null;
    
    return createPortal(modalContent, modalRoot);
}
