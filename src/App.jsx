import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import Login from './pages/Login';
import Painel from './pages/Painel';
import Contatos from './pages/Contatos';
import Agendamentos from './pages/Agendamentos';
import Agenda from './pages/Agenda';

function AppContent() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('painel');

  if (loading) return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return <Login />;

  return (
    <div className="min-h-screen bg-dark text-white font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="ml-[260px] min-h-screen">
        {activeTab === 'painel' && <Painel />}
        {activeTab === 'contatos' && <Contatos />}
        {activeTab === 'agendamentos' && <Agendamentos />}
        {activeTab === 'agenda' && <Agenda />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}