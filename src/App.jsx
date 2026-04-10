import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import Painel from './pages/Painel';
import Contatos from './pages/Contatos';
import Agendamentos from './pages/Agendamentos';
import Agenda from './pages/Agenda';

export default function App() {
  const [activeTab, setActiveTab] = useState('painel');

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