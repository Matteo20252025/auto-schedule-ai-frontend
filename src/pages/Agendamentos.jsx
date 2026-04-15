import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { StatusBadge } from '../components/StatusBadge';
import { X } from 'lucide-react';

export default function Agendamentos() {
  const [appointments, setAppointments] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterData, setFilterData] = useState('');
  const [filterProfissional, setFilterProfissional] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const [resApps, resProfs] = await Promise.all([
        supabase.from('view_consultas').select('*').order('start_time', { ascending: false }),
        supabase.from('profissionais').select('*')
      ]);
      setAppointments(resApps.data || []);
      setProfissionais(resProfs.data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filtered = appointments.filter(a => {
    const matchData = filterData ? a.start_time?.startsWith(filterData) : true;
    const matchProf = filterProfissional === 'todos' || a.profissional === filterProfissional;
    const matchStatus = filterStatus === 'todos' || a.status === filterStatus;
    return matchData && matchProf && matchStatus;
  });

  return (
    <div className="p-8">
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="date"
          className="bg-panel border border-border text-white text-sm rounded-lg px-4 py-2 outline-none focus:border-gold"
          value={filterData}
          onChange={(e) => setFilterData(e.target.value)}
        />
        <select
          className="bg-panel border border-border text-white text-sm rounded-lg px-4 py-2 outline-none focus:border-gold"
          value={filterProfissional}
          onChange={(e) => setFilterProfissional(e.target.value)}
        >
          <option value="todos">Todos os Profissionais</option>
          {profissionais.map(p => (
            <option key={p.id} value={p.nome}>{p.nome}</option>
          ))}
        </select>
        <select
          className="bg-panel border border-border text-white text-sm rounded-lg px-4 py-2 outline-none focus:border-gold"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="todos">Todos os Status</option>
          <option value="pending">Pendente</option>
          <option value="confirmed">Confirmado</option>
          <option value="cancelled">Cancelado</option>
          <option value="completed">Concluido</option>
        </select>
        {(filterData || filterProfissional !== 'todos' || filterStatus !== 'todos') && (
          <button
            onClick={() => { setFilterData(''); setFilterProfissional('todos'); setFilterStatus('todos'); }}
            className="text-grayText hover:text-white text-sm flex items-center gap-1"
          >
            <X size={14} /> Limpar filtros
          </button>
        )}
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
                <th className="px-6 py-4">Data/Hora</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Profissional</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-grayText text-sm">
                    Nenhum agendamento encontrado.
                  </td>
                </tr>
              )}
              {filtered.map(a => (
                <tr key={a.id} className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setSelected(a)}>
                  <td className="px-6 py-4 text-sm text-white">
                    {format(new Date(a.start_time), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white font-medium text-sm">{a.paciente || a.lead_name || '-'}</p>
                    <p className="text-xs text-grayText">{a.telefone || a.lead_phone || '-'}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-grayText">{a.profissional || a.professional_name || '-'}</td>
                  <td className="px-6 py-4"><StatusBadge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative bg-panel border border-border rounded-xl p-8 w-full max-w-md shadow-2xl">
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-grayText hover:text-white">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-white mb-6">Detalhes do Agendamento</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-grayText uppercase mb-1">Cliente</p>
                <p className="text-white font-medium">{selected.paciente || selected.lead_name || '-'}</p>
                <p className="text-sm text-grayText">{selected.telefone || selected.lead_phone || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-grayText uppercase mb-1">Data e Hora</p>
                <p className="text-white">{format(new Date(selected.start_time), "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
              </div>
              <div>
                <p className="text-xs text-grayText uppercase mb-1">Profissional</p>
                <p className="text-white">{selected.profissional || selected.professional_name || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-grayText uppercase mb-1">Status</p>
                <StatusBadge status={selected.status} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}