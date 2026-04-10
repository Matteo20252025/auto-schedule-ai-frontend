import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Search } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { ToggleAgente } from '../components/ToggleAgente';
import { ContatoDrawer } from '../components/ContatoDrawer';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Contatos() {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [selectedLead, setSelectedLead] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      const { data } = await supabase.from('view_leads').select('*');
      setLeads(data || []);
      setLoading(false);
    };
    fetchLeads();
  }, []);

  const filteredLeads = leads.filter(l => {
    const matchesSearch = l.name?.toLowerCase().includes(search.toLowerCase()) || l.phone?.includes(search);
    const matchesStatus = filterStatus === 'todos' || l.crm_status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-grayText" size={16} />
          <input
            className="w-full bg-panel border border-border rounded-lg pl-10 pr-4 py-2 text-white text-sm focus:outline-none focus:border-gold"
            placeholder="Buscar por nome ou telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="bg-panel border border-border text-white text-sm rounded-lg px-4 py-2 outline-none focus:border-gold"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="todos">Todos os Status</option>
          <option value="novo">Novo</option>
          <option value="em contato">Em Contato</option>
          <option value="cliente">Cliente</option>
          <option value="inativo">Inativo</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-panel rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="bg-panel border border-border rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-grayText text-xs uppercase">
              <tr>
                <th className="px-6 py-4">Contato</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Ultima Interacao</th>
                <th className="px-6 py-4">Agendamentos</th>
                <th className="px-6 py-4">Agente IA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-grayText text-sm">
                    Nenhum contato encontrado.
                  </td>
                </tr>
              )}
              {filteredLeads.map(lead => (
                <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <button onClick={() => setSelectedLead(lead)} className="text-white font-medium hover:text-gold transition-colors text-left">
                      {lead.name || 'Sem nome'}
                    </button>
                    <p className="text-xs text-grayText">{lead.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={lead.crm_status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-grayText">
                    {lead.last_interaction
                      ? formatDistanceToNow(new Date(lead.last_interaction), { addSuffix: true, locale: ptBR })
                      : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-white">
                    {lead.total_consultas || 0}
                  </td>
                  <td className="px-6 py-4">
                    <ToggleAgente
                      leadId={lead.id}
                      status={lead.ai_status}
                      onUpdate={(newS) => setLeads(leads.map(l => l.id === lead.id ? { ...l, ai_status: newS } : l))}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ContatoDrawer lead={selectedLead} onClose={() => setSelectedLead(null)} />
    </div>
  );
}