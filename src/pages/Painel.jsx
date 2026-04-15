import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CheckCircle2, AlertCircle, Clock, User } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';

export default function Painel() {
  const [waitingLeads, setWaitingLeads] = useState([]);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const prevCountRef = useRef(0);

  const playAlert = () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [0, 0.3, 0.6].forEach(delay => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.4, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.4);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.4);
    });
  };

  const fetchData = async () => {
    const today = new Date().toISOString().split('T')[0];
    const [resLeads, resApps] = await Promise.all([
      supabase.from('view_espera_humano').select('*'),
      supabase.from('view_consultas').select('*')
        .gte('start_time', `${today}T00:00:00`)
        .lte('start_time', `${today}T23:59:59`)
    ]);

    const leads = resLeads.data || [];

    if (leads.length > prevCountRef.current) {
      playAlert();
    }
    prevCountRef.current = leads.length;

    setWaitingLeads(leads);
    setTodayAppointments(resApps.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAssume = async (id) => {
    await supabase.from('leads').update({ waiting_human: false, ai_status: 'paused' }).eq('id', id);
    fetchData();
  };

  if (loading) return (
    <div className="p-8 space-y-4 animate-pulse">
      <div className="h-24 bg-panel rounded-xl" />
      <div className="h-64 bg-panel rounded-xl" />
    </div>
  );

  return (
    <div className="p-8 space-y-8">
      {waitingLeads.length > 0 ? (
        <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-xl flex items-center gap-4">
          <div className="bg-amber-500 p-3 rounded-full">
            <AlertCircle className="text-black" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {waitingLeads.length} contato{waitingLeads.length > 1 ? 's' : ''} aguardando atendimento
            </h2>
            <p className="text-grayText text-sm">Intervenção humana necessária.</p>
          </div>
        </div>
      ) : (
        <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-xl flex items-center gap-3">
          <CheckCircle2 className="text-green-400" size={20} />
          <span className="text-green-400 font-medium">Nenhum contato aguardando no momento.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-panel border border-border rounded-xl p-6">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <User size={16} className="text-gold" /> Fila de Espera
          </h3>
          <div className="space-y-3">
            {waitingLeads.length === 0 && (
              <p className="text-grayText text-sm">Nenhum contato na fila.</p>
            )}
            {waitingLeads.map(lead => (
              <div key={lead.id} className="flex items-center justify-between p-4 bg-dark rounded-lg border border-border">
                <div>
                  <p className="font-semibold text-white">{lead.name || 'Sem nome'}</p>
                  <p className="text-xs text-grayText flex items-center gap-1 mt-1">
                    <Clock size={10} />
                    {lead.last_interaction
                      ? formatDistanceToNow(new Date(lead.last_interaction), { addSuffix: true, locale: ptBR })
                      : 'Sem interação'}
                  </p>
                </div>
                <button
                  onClick={() => handleAssume(lead.id)}
                  className="bg-gold text-black px-4 py-2 rounded-lg font-bold text-xs hover:opacity-90 transition-opacity"
                >
                  Assumir
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-panel border border-border rounded-xl p-6">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Clock size={16} className="text-gold" /> Agendamentos de Hoje
          </h3>
          <div className="space-y-3">
            {todayAppointments.length === 0 && (
              <p className="text-grayText text-sm">Nenhum agendamento para hoje.</p>
            )}
            {todayAppointments.map(app => (
              <div key={app.id} className="flex items-center justify-between p-4 bg-dark rounded-lg border border-border">
                <div>
                  <p className="font-semibold text-white">{app.paciente || app.lead_name || 'Sem nome'}</p>
                  <p className="text-xs text-grayText mt-1">
                    {format(new Date(app.start_time), "HH:mm", { locale: ptBR })} • {app.profissional || app.professional_name || '-'}
                  </p>
                </div>
                <StatusBadge status={app.status} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}