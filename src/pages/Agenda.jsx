import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';

export default function Agenda() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [apps, setApps] = useState([]);

  useEffect(() => {
    const fetchMonthApps = async () => {
      const first = startOfMonth(currentMonth).toISOString();
      const last = endOfMonth(currentMonth).toISOString();
      const { data } = await supabase
        .from('view_consultas')
        .select('*')
        .gte('start_time', first)
        .lte('start_time', last);
      setApps(data || []);
    };
    fetchMonthApps();
  }, [currentMonth]);

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth), { locale: ptBR }),
    end: endOfWeek(endOfMonth(currentMonth), { locale: ptBR })
  });

  const dayApps = apps.filter(a => isSameDay(new Date(a.start_time), selectedDay));

  return (
    <div className="p-8 flex gap-6 h-full">
      <div className="flex-1 bg-panel border border-border rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-white capitalize">
            {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 hover:bg-white/5 rounded-lg text-grayText hover:text-white transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 hover:bg-white/5 rounded-lg text-grayText hover:text-white transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 mb-2">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
            <div key={d} className="text-center text-xs font-bold text-grayText uppercase py-2">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map(day => {
            const dayAppCount = apps.filter(a => isSameDay(new Date(a.start_time), day)).length;
            const isSelected = isSameDay(day, selectedDay);
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, currentMonth);

            return (
              <button
                key={day.toString()}
                onClick={() => setSelectedDay(day)}
                className={`h-20 p-2 rounded-lg relative transition-all flex flex-col items-start ${
                  !isCurrentMonth ? 'opacity-20' : ''
                } ${isSelected ? 'bg-gold/10 ring-1 ring-gold' : 'hover:bg-white/5'}`}
              >
                <span className={`text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full ${
                  isToday ? 'bg-gold text-black font-bold' : 'text-white'
                }`}>
                  {format(day, 'd')}
                </span>
                {dayAppCount > 0 && (
                  <div className="mt-auto flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-gold rounded-full" />
                    <span className="text-[10px] text-gold font-bold">{dayAppCount}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="w-72 bg-panel border border-border rounded-xl p-6 overflow-y-auto">
        <h3 className="text-base font-bold text-white mb-4 capitalize">
          {format(selectedDay, "dd 'de' MMMM", { locale: ptBR })}
        </h3>
        <div className="space-y-3">
          {dayApps.length === 0 ? (
            <p className="text-grayText text-sm italic">Nenhum agendamento para este dia.</p>
          ) : dayApps.map(a => (
            <div key={a.id} className="p-4 bg-dark border border-border rounded-lg">
              <p className="text-gold font-bold text-sm">
                {format(new Date(a.start_time), 'HH:mm', { locale: ptBR })}
              </p>
              <p className="text-white font-medium text-sm mt-1">{a.paciente || a.lead_name || '-'}</p>
              <p className="text-xs text-grayText">{a.profissional || a.professional_name || '-'}</p>
              <div className="mt-2">
                <StatusBadge status={a.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}