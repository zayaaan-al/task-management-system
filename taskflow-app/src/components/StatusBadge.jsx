const StatusBadge = ({ status }) => {
  const styles = {
    Pending: 'bg-[#ffdbcd] text-[#360f00]',
    'In Progress': 'bg-[#d0e1fb] text-[#54647a]',
    Completed: 'bg-green-100 text-green-700',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
