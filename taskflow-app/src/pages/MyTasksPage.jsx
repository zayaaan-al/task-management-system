import { useState, useEffect, useCallback } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../services/taskService';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import toast from 'react-hot-toast';

const STATUSES = ['All', 'Pending', 'In Progress', 'Completed'];
const PRIORITIES = ['All', 'High', 'Medium', 'Low'];

const MyTasksPage = () => {
  // ── Task State ────────────────────────────────────────────────────────────────
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [fetchError, setFetchError] = useState('');

  // ── Filter State ──────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // ── Modal State ───────────────────────────────────────────────────────────────
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // ── Fetch Tasks ───────────────────────────────────────────────────────────────
  const fetchTasks = useCallback(async () => {
    setLoadingTasks(true);
    setFetchError('');
    try {
      const { data } = await getTasks();
      setTasks(Array.isArray(data) ? data : data.tasks || []);
    } catch {
      setFetchError('Failed to load tasks. Please try again.');
    } finally {
      setLoadingTasks(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  // ── Filter Logic ──────────────────────────────────────────────────────────────
  useEffect(() => {
    let result = [...tasks];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title?.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'All') {
      result = result.filter((t) => t.status === statusFilter);
    }

    if (priorityFilter !== 'All') {
      result = result.filter((t) => t.priority === priorityFilter);
    }

    setFilteredTasks(result);
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  // ── Task Counts (for Sidebar) ─────────────────────────────────────────────────
  const taskCounts = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === 'Pending').length,
    inProgress: tasks.filter((t) => t.status === 'In Progress').length,
    completed: tasks.filter((t) => t.status === 'Completed').length,
  };

  // ── CRUD Handlers ─────────────────────────────────────────────────────────────
  const handleOpenCreate = () => {
    setSelectedTask(null);
    setTaskModalOpen(true);
  };

  const handleOpenEdit = (task) => {
    setSelectedTask(task);
    setTaskModalOpen(true);
  };

  const handleOpenDelete = (task) => {
    setSelectedTask(task);
    setDeleteModalOpen(true);
  };

  const handleSubmitTask = async (formData) => {
    setModalLoading(true);
    try {
      if (selectedTask) {
        await updateTask(selectedTask._id, formData);
        toast.success('Task updated successfully! ✏️');
      } else {
        await createTask(formData);
        toast.success('Task created successfully! 🎉');
      }
      setTaskModalOpen(false);
      setSelectedTask(null);
      await fetchTasks();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to save task.';
      toast.error(message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    setModalLoading(true);
    try {
      await deleteTask(selectedTask._id);
      toast.success('Task deleted successfully! 🗑️');
      setDeleteModalOpen(false);
      setSelectedTask(null);
      await fetchTasks();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete task.';
      toast.error(message);
    } finally {
      setModalLoading(false);
    }
  };

  const hasActiveFilters =
    searchQuery || statusFilter !== 'All' || priorityFilter !== 'All';

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setPriorityFilter('All');
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      <Navbar onSearch={setSearchQuery} />
      <Sidebar taskCounts={taskCounts} />

      <main className="lg:ml-[280px] p-6 lg:p-8 max-w-[1440px] transition-all duration-300">

        {/* ── Page Header ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 animate-fade-in-up">
          <div>
            <h1 className="font-['Manrope'] text-3xl font-bold text-[#191c1e] tracking-tight">
              My Tasks
            </h1>
            <p className="text-sm text-[#737686] mt-1">
              {loadingTasks
                ? 'Fetching your tasks…'
                : `${tasks.length} task${tasks.length !== 1 ? 's' : ''} · ${taskCounts.completed} completed`}
            </p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-6 py-3 bg-[#004ac6] text-white rounded-xl font-semibold text-sm shadow-level-1 hover:bg-[#003ea8] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>add</span>
            Create Task
          </button>
        </div>

        {/* ── Filter & Search Bar ──────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 mb-6 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>

          {/* Mobile inline search (visible only when Navbar search is hidden) */}
          <div className="flex lg:hidden items-center bg-white border border-[#c3c6d7] rounded-xl px-4 py-2.5 gap-2 focus-within:border-[#004ac6] focus-within:ring-2 focus-within:ring-[#004ac6]/10 transition-all">
            <span className="material-symbols-outlined text-[#737686]" style={{ fontSize: 20 }}>search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks by title or description…"
              className="bg-transparent border-none outline-none text-sm flex-1 placeholder:text-[#737686]/70"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-[#737686] hover:text-[#191c1e] transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
              </button>
            )}
          </div>

          {/* Filter row */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">

            {/* Status pill group */}
            <div className="flex items-center gap-1 bg-white border border-[#c3c6d7] rounded-xl overflow-hidden p-1 flex-wrap">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === s
                      ? 'bg-[#004ac6] text-white shadow-sm'
                      : 'text-[#737686] hover:bg-[#f2f4f6]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Right-side controls */}
            <div className="flex gap-2 items-center flex-wrap">
              {/* Priority dropdown */}
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-[#c3c6d7] focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/10 outline-none text-sm bg-white text-[#434655] transition-all"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    Priority: {p}
                  </option>
                ))}
              </select>

              {/* Clear filters */}
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="flex items-center gap-1.5 px-3 py-2.5 border border-[#c3c6d7] rounded-xl text-xs font-semibold text-[#737686] hover:bg-[#ffdad6] hover:text-[#ba1a1a] hover:border-[#ffdad6] transition-all"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>filter_alt_off</span>
                  Clear
                </button>
              )}

              {/* Refresh */}
              <button
                onClick={fetchTasks}
                className="p-2.5 border border-[#c3c6d7] rounded-xl hover:bg-[#eceef0] transition-all"
                title="Refresh tasks"
              >
                <span className="material-symbols-outlined text-[#737686]" style={{ fontSize: 20 }}>refresh</span>
              </button>
            </div>
          </div>

          {/* Active filter summary badge */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap animate-fade-in-up">
              <span className="text-xs text-[#737686] font-medium">Active filters:</span>
              {searchQuery && (
                <span className="flex items-center gap-1 bg-[#dbe1ff] text-[#004ac6] text-xs font-semibold px-2.5 py-1 rounded-full">
                  <span className="material-symbols-outlined" style={{ fontSize: 12 }}>search</span>
                  "{searchQuery}"
                </span>
              )}
              {statusFilter !== 'All' && (
                <span className="flex items-center gap-1 bg-[#dbe1ff] text-[#004ac6] text-xs font-semibold px-2.5 py-1 rounded-full">
                  {statusFilter}
                </span>
              )}
              {priorityFilter !== 'All' && (
                <span className="flex items-center gap-1 bg-[#dbe1ff] text-[#004ac6] text-xs font-semibold px-2.5 py-1 rounded-full">
                  {priorityFilter} Priority
                </span>
              )}
              <span className="text-xs text-[#737686]">
                — {filteredTasks.length} result{filteredTasks.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        {/* ── Task Grid / States ───────────────────────────────────────────────── */}
        {loadingTasks ? (
          /* Loading State */
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div
              className="loader"
              style={{
                width: 40,
                height: 40,
                borderWidth: 3,
                borderColor: 'rgba(0,74,198,0.15)',
                borderTopColor: '#004ac6',
              }}
            />
            <p className="text-sm text-[#737686] font-medium">Loading your tasks…</p>
          </div>

        ) : fetchError ? (
          /* Error State */
          <div className="flex flex-col items-center justify-center py-32 gap-4 animate-fade-in-up">
            <div className="w-20 h-20 bg-[#ffdad6] rounded-3xl flex items-center justify-center">
              <span className="material-symbols-outlined text-[#ba1a1a]" style={{ fontSize: 40 }}>
                error_outline
              </span>
            </div>
            <p className="font-['Manrope'] text-lg font-semibold text-[#191c1e]">
              Something went wrong
            </p>
            <p className="text-sm text-[#737686]">{fetchError}</p>
            <button
              onClick={fetchTasks}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#004ac6] text-white rounded-xl text-sm font-semibold hover:bg-[#003ea8] transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>refresh</span>
              Try Again
            </button>
          </div>

        ) : filteredTasks.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-32 gap-4 animate-fade-in-up">
            <div className="w-20 h-20 bg-[#dbe1ff] rounded-3xl flex items-center justify-center">
              <span className="material-symbols-outlined text-[#004ac6]" style={{ fontSize: 40 }}>
                {hasActiveFilters ? 'filter_alt_off' : 'task_alt'}
              </span>
            </div>
            <p className="font-['Manrope'] text-lg font-semibold text-[#191c1e]">
              {hasActiveFilters ? 'No tasks match your filters' : 'No tasks yet'}
            </p>
            <p className="text-sm text-[#737686] text-center max-w-xs">
              {hasActiveFilters
                ? 'Try adjusting your search or filter criteria.'
                : 'Create your first task to stay on top of your work!'}
            </p>
            {hasActiveFilters ? (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-2 px-5 py-2.5 border border-[#c3c6d7] rounded-xl text-sm font-semibold text-[#434655] hover:bg-[#eceef0] transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>filter_alt_off</span>
                Clear Filters
              </button>
            ) : (
              <button
                onClick={handleOpenCreate}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#004ac6] text-white rounded-xl text-sm font-semibold hover:bg-[#003ea8] transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
                Create First Task
              </button>
            )}
          </div>

        ) : (
          /* Task Grid */
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 animate-fade-in-up">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── Floating Action Button (Mobile) ────────────────────────────────────── */}
      <button
        onClick={handleOpenCreate}
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#004ac6] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[60] lg:hidden"
        aria-label="Create task"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 28 }}>add</span>
      </button>

      {/* ── Modals ───────────────────────────────────────────────────────────────── */}
      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => { setTaskModalOpen(false); setSelectedTask(null); }}
        onSubmit={handleSubmitTask}
        task={selectedTask}
        loading={modalLoading}
      />
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setSelectedTask(null); }}
        onConfirm={handleConfirmDelete}
        task={selectedTask}
        loading={modalLoading}
      />
    </div>
  );
};

export default MyTasksPage;
