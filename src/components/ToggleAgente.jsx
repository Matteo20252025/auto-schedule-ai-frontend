import { Lock, Unlock } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export const ToggleAgente = ({ leadId, status, onUpdate }) => {
  const toggle = async () => {
    const newStatus = status === 'active' ? 'paused' : 'active';
    const { error } = await supabase.from('leads').update({ ai_status: newStatus }).eq('id', leadId);
    if (!error) onUpdate(newStatus);
  };

  return (
    <button onClick={toggle} className="flex items-center gap-2 transition-opacity hover:opacity-80">
      {status === 'active' ? (
        <span className="flex items-center gap-1.5 text-green-400 text-xs font-bold">
          <Unlock size={14} /> ATIVO
        </span>
      ) : (
        <span className="flex items-center gap-1.5 text-red-400 text-xs font-bold">
          <Lock size={14} /> PAUSADO
        </span>
      )}
    </button>
  );
};