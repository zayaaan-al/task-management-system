import StatusBadge from './StatusBadge';

const TaskCard = ({ task, onEdit, onDelete }) => {
  const priorityColors = {
    High: 'text-red-600',
    Medium: 'text-amber-600',
    Low: 'text-green-600',
  };

  return (
    <div className="group relative bg-white p-6 rounded-2xl shadow-level-1 border border-transparent hover:border-[#004ac6]/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <StatusBadge status={task.status} />
          {task.priority && (
            <span className={`text-xs font-semibold ${priorityColors[task.priority] || 'text-gray-500'}`}>
              ● {task.priority}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg hover:bg-[#d0e1fb] text-[#54647a] hover:text-[#004ac6] transition-colors"
            title="Edit task"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit</span>
          </button>
          <button
            onClick={() => onDelete(task)}
            className="p-1.5 rounded-lg hover:bg-[#ffdad6] text-[#737686] hover:text-[#ba1a1a] transition-colors"
            title="Delete task"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
          </button>
        </div>
      </div>

      <h3 className="font-['Manrope'] text-[20px] font-semibold text-[#191c1e] mb-2 group-hover:text-[#004ac6] transition-colors leading-snug">
        {task.title}
      </h3>
      <p className="text-sm text-[#434655] mb-5 line-clamp-2 leading-relaxed">
        {task.description || 'No description provided.'}
      </p>

      {task.status === 'In Progress' && typeof task.progress === 'number' && (
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 bg-[#eceef0] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#004ac6] h-full rounded-full transition-all" style={{ width: `${task.progress}%` }} />
          </div>
          <span className="text-xs font-semibold text-[#004ac6]">{task.progress}%</span>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-[#c3c6d7]">
        <div className="flex items-center gap-1 text-[#434655]">
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>calendar_today</span>
          <span className="text-xs font-medium">
            {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No due date'}
          </span>
        </div>
        {task.category && (
          <span className="text-xs text-[#737686] bg-[#eceef0] px-2 py-0.5 rounded-full">{task.category}</span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
