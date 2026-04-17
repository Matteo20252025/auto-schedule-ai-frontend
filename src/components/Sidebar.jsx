import { useEffect, useState } from 'react';
import { LayoutDashboard, Users, CalendarCheck, CalendarDays, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

const menuItems = [
  { id: 'painel', label: 'Painel', icon: LayoutDashboard },
  { id: 'contatos', label: 'Contatos', icon: Users },
  { id: 'agendamentos', label: 'Agendamentos', icon: CalendarCheck },
  { id: 'agenda', label: 'Agenda', icon: CalendarDays },
];

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const { signOut, orgId } = useAuth();
  const [orgName, setOrgName] = useState('');

  useEffect(() => {
    if (!orgId) return;
    supabase.from('organizations').select('name').eq('id', orgId).single()
      .then(({ data }) => { if (data) setOrgName(data.name); });
  }, [orgId]);

  return (
    <aside className="w-[260px] h-screen bg-panel border-r border-border fixed left-0 top-0 flex flex-col">
      <div style={{ height: '185px', overflow: 'hidden' }}>
        <img
          src="/LOGO-FOCO-IA-2-0-sem-fundo.png"
          alt="Foco.ia"
          style={{ width: '100%', height: 'auto', marginTop: '-30px' }}
        />
      </div>

      <nav className="flex-1 px-4 mt-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm ${
              activeTab === item.id
                ? 'bg-gold/10 text-gold font-semibold'
                : 'text-grayText hover:bg-white/5 hover:text-white'
            }`}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </button>
        ))}

        {orgName && (
          <div className="px-4 py-3 mt-2">
            <p className="text-xs text-grayText">{orgName}</p>
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-border space-y-2">
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-grayText hover:bg-white/5 hover:text-white transition-all text-sm"
        >
          <LogOut size={18} />
          <span>Sair</span>
        </button>
        <p className="text-[10px] text-grayText text-center">Foco.ia CRM v1.0</p>
      </div>
    </aside>
  );
};