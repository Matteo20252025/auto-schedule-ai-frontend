export const StatusBadge = ({ status }) => {
  const config = {
    novo: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "em contato": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    cliente: "bg-green-500/10 text-green-400 border-green-500/20",
    inativo: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    confirmed: "bg-green-500/10 text-green-400 border-green-500/20",
    cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
    completed: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  };

  const labels = {
    novo: "Novo",
    "em contato": "Em Contato",
    cliente: "Cliente",
    inativo: "Inativo",
    pending: "Pendente",
    confirmed: "Confirmado",
    cancelled: "Cancelado",
    completed: "Concluído",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${config[status] || config.inativo}`}>
      {labels[status] || status}
    </span>
  );
};