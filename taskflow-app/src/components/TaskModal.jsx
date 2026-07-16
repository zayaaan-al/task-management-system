import { useEffect, useState } from 'react';

const STATUSES = ['Pending', 'In Progress', 'Completed'];
const PRIORITIES = ['Low', 'Medium', 'High'];
const CATEGORIES = ['Design', 'Development', 'Marketing', 'Research', 'Operations', 'Other'];

const defaultForm = {
  title: '',
  description: '',
  status: 'Pending',
  priority: 'Medium',
  category: '',
  dueDate: '',
  progress: 0,
};

const TaskModal = ({ isOpen, onClose, onSubmit, task, loading }) => {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'Pending',
        priority: task.priority || 'Medium',
        category: task.category || '',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        progress: task.progress ?? 0,
      });
    } else {
      setForm(defaultForm);
    }
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-3xl shadow-level-2 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-[#eceef0]">
          <div>
            <h2 className="font-['Manrope'] text-xl font-bold text-[#191c1e]">
              {task ? 'Edit Task' : 'Create New Task'}
            </h2>
            <p className="text-xs text-[#737686] mt-0.5">
              {task ? 'Update the task details below.' : 'Fill in the details to add a new task.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[#eceef0] text-[#737686] transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#434655] uppercase tracking-wide">
              Task Title *
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="e.g., Review Q4 Marketing Proposal"
              className="w-full px-4 py-3 border border-[#c3c6d7] rounded-xl focus:border-[#004ac6] focus:ring-4 focus:ring-[#004ac6]/10 outline-none text-sm transition-all placeholder:text-[#737686]/60"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#434655] uppercase tracking-wide">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Add more details about this task..."
              className="w-full px-4 py-3 border border-[#c3c6d7] rounded-xl focus:border-[#004ac6] focus:ring-4 focus:ring-[#004ac6]/10 outline-none text-sm transition-all resize-none placeholder:text-[#737686]/60"
            />
          </div>

          {/* Status + Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#434655] uppercase tracking-wide">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#c3c6d7] rounded-xl focus:border-[#004ac6] focus:ring-4 focus:ring-[#004ac6]/10 outline-none text-sm bg-white"
              >
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#434655] uppercase tracking-wide">Priority</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#c3c6d7] rounded-xl focus:border-[#004ac6] focus:ring-4 focus:ring-[#004ac6]/10 outline-none text-sm bg-white"
              >
                {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* Category + Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#434655] uppercase tracking-wide">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#c3c6d7] rounded-xl focus:border-[#004ac6] focus:ring-4 focus:ring-[#004ac6]/10 outline-none text-sm bg-white"
              >
                <option value="">Select...</option>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#434655] uppercase tracking-wide">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {/* Progress (only for In Progress) */}
          {form.status === 'In Progress' && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#434655] uppercase tracking-wide">
                Progress: <span className="text-[#004ac6]">{form.progress}%</span>
              </label>
              <input
                type="range"
                name="progress"
                min={0}
                max={100}
                value={form.progress}
                onChange={handleChange}
                className="w-full accent-[#004ac6]"
              />
              <div className="w-full bg-[#eceef0] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#004ac6] h-full rounded-full transition-all" style={{ width: `${form.progress}%` }} />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-[#c3c6d7] rounded-xl text-sm font-semibold text-[#434655] hover:bg-[#f2f4f6] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-[#004ac6] text-white rounded-xl text-sm font-semibold hover:bg-[#003ea8] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? <div className="loader" /> : null}
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
