import { useEffect, useState } from 'react';
import { X, MessageSquare, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { StatusBadge } from './StatusBadge';

export const ContatoDrawer = ({ lead, onClose }) => {
  const [tab, setTab] = useState('chat');
  const [messages, setMessages] = useState([]);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!lead) return;
    setLoading(true);

    const fetchChat = async () => {
      const { data } = await supabase
        .from('n8n_chat_histories')
        .select('*')
        .eq('session_id', lead.id)
        .order('id', { ascending: true });

      const parsed = (data || []).map(row => ({
        id: row.id,
        type: row.message?.type,
        content: typeof row.message?.content === 'string' ? row.message.content : '',
        created_at: row.created_at,
      })).filter(m => m.content);

      setMessages(parsed);
    };

    const fetchApps = async () => {
      const { data } = await supabase
        .from('view_consultas')
        .select('*')
        .eq('lead_id', lead.id)
        .order('start_time', { ascending: false });
      setApps(data || []);
      setLoading(false);
    };

    fetchChat();
    fetchApps();
  }, [lead]);

  if (!lead) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-panel h-screen border-l border-border flex flex-col shadow-2xl">

        <div className="p-6 border-b border-border flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">{lead.name || 'Sem nome'}</h2>
            <p className="text-sm text-grayText">{lead.phone}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-grayText hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b border-border">
          <button
            onClick={() => setTab('chat')}
            className={`flex-1 py-4 flex justify-center items-center gap-2 text-sm font-medium transition-colors ${
              tab === 'chat' ? 'text-gold border-b-2 border-gold' : 'text-grayText hover:text-white'
            }`}
          >
            <MessageSquare size={16} /> Conversas
          </button>
          <button
            onClick={() => setTab('apps')}
            className={`flex-1 py-4 flex justify-center items-center gap-2 text-sm font-medium transition-colors ${
              tab === 'apps' ? 'text-gold border-b-2 border-gold' : 'text-grayText hover:text-white'
            }`}
          >
            <Calendar size={16} /> Agendamentos
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-10 bg-white/5 rounded-lg" />
              <div className="h-10 bg-white/5 rounded-lg w-3/4" />
              <div className="h-10 bg-white/5 rounded-lg" />
            </div>
          ) : tab === 'chat' ? (
            <div className="space-y-4">
              {messages.length === 0 && (
                <p className="text-grayText text-sm text-center mt-8">Nenhuma mensagem encontrada.</p>
              )}
              {messages.map(m => (
                <div key={m.id} className={`flex flex-col ${m.type === 'human' ? 'items-start' : 'items-end'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    m.type === 'human'
                      ? 'bg-[#1e1e1e] text-white rounded-tl-none'
                      : 'bg-gold text-black rounded-tr-none'
                  }`}>
                    {m.content}
                  </div>
                  <span className="text-[10px] text-grayText mt-1">
                    {format(new Date(new Date(m.created_at).getTime() - 3 * 60 * 60 * 1000), "HH:mm", { locale: ptBR })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {apps.length === 0 && (
                <p className="text-grayText text-sm text-center mt-8">Nenhum agendamento encontrado.</p>
              )}
              {apps.map(a => (
                <div key={a.id} className="p-4 bg-dark rounded-lg border border-border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-bold text-sm">
                      {format(new Date(a.start_time), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </span>
                    <StatusBadge status={a.status} />
                  </div>
                  <p className="text-xs text-grayText">{a.profissional || 'Profissional não informado'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};