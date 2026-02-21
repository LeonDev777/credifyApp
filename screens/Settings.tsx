import React, { useRef } from 'react';
import { Debt } from '../types';

interface SettingsProps {
  debts: Debt[];
  onImport: (debts: Debt[]) => void;
  onClearAll: () => void;
  onClearPaid: () => void;
}

const Settings: React.FC<SettingsProps> = ({ debts, onImport, onClearAll, onClearPaid }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportData = () => {
    const dataStr = JSON.stringify(debts, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `credify_backup_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          if (Array.isArray(json)) {
            onImport(json);
          } else {
            alert('Formato de arquivo inválido.');
          }
        } catch (err) {
          alert('Erro ao ler o arquivo de backup.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Gerenciamento de Dados</h3>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <button 
            onClick={exportData}
            className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors border-b border-gray-50"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-800">Exportar Backup</p>
                <p className="text-xs text-slate-400">Baixe um arquivo com todas as dívidas</p>
              </div>
            </div>
            <svg className="text-slate-300" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>

          <button 
            onClick={handleImportClick}
            className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-800">Importar Backup</p>
                <p className="text-xs text-slate-400">Restaurar dados de um arquivo .json</p>
              </div>
            </div>
            <svg className="text-slate-300" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
        </div>
      </div>

      <div>
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Limpeza e Organização</h3>
        <div className="space-y-3">
          <button 
            onClick={onClearPaid}
            className="w-full flex items-center gap-4 p-5 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-700 hover:bg-emerald-100 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <div className="text-left">
              <p className="text-sm font-bold">Limpar Dívidas Quitadas</p>
              <p className="text-xs opacity-70">Apagar apenas quem já pagou tudo</p>
            </div>
          </button>

          <button 
            onClick={onClearAll}
            className="w-full flex items-center gap-4 p-5 bg-rose-50 rounded-2xl border border-rose-100 text-rose-600 hover:bg-rose-100 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
            </div>
            <div className="text-left">
              <p className="text-sm font-bold">Limpar Todos os Dados</p>
              <p className="text-xs opacity-70">Apagar tudo permanentemente</p>
            </div>
          </button>
        </div>
      </div>

      <div className="pt-10 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Credify v1.1.0</p>
        <p className="text-[10px] text-slate-400 mt-1">Desenvolvido para sua liberdade financeira</p>
      </div>
    </div>
  );
};

export default Settings;