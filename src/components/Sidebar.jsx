import { LayoutDashboard, Users, CalendarCheck, CalendarDays } from 'lucide-react';

const menuItems = [
  { id: 'painel', label: 'Painel', icon: LayoutDashboard },
  { id: 'contatos', label: 'Contatos', icon: Users },
  { id: 'agendamentos', label: 'Agendamentos', icon: CalendarCheck },
  { id: 'agenda', label: 'Agenda', icon: CalendarDays },
];

export const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="w-[260px] h-screen bg-panel border-r border-border fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col">
          <img src="/logo.png" alt="Foco.ia" className="h-8 mb-2" onError={(e) => e.target.style.display='none'} />
          <span className="text-2xl font-bold text-white tracking-tight">
            Foco<span className="text-gold">.</span>ia
          </span>
          <span className="text-[10px] text-grayText uppercase tracking-[0.2em] mt-1">
            Menos esforço. Mais lucro.
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 mt-6 space-y-1">
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
      </nav>

      <div className="p-4 border-t border-border">
        <p className="text-[10px] text-grayText text-center">Foco.ia CRM v1.0</p>
      </div>
    </aside>
  );
};