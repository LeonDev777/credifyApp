import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  onBack?: () => void;
  actions?: React.ReactNode;
  fab?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, title, onBack, actions, fab }) => {
  return (
    <div className="mobile-container">
      <header className="px-6 pt-10 pb-6 flex items-center justify-between bg-white border-b border-gray-100 shrink-0 z-10">
        <div className="flex items-center gap-4">
          {onBack && (
            <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
          )}
          <h1 className="text-xl font-bold text-slate-900">{title}</h1>
        </div>
        <div className="flex items-center">{actions}</div>
      </header>
      
      <main className="flex-1 overflow-y-auto bg-gray-50/50 no-scrollbar relative">
        {children}
      </main>

      {/* Botão Flutuante (FAB) - Fixo na ponta direita do container de 480px */}
      {fab && (
        <div className="absolute bottom-8 right-6 z-50 pointer-events-none">
          <div className="pointer-events-auto">
            {fab}
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;