import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTasks, createTask, updateTask, deleteTask } from '../services/taskService';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import toast from 'react-hot-toast';

const STATUSES = ['All', 'Pending', 'In Progress', 'Completed'];
const PRIORITIES = ['All', 'High', 'Medium', 'Low'];

const StatCard = ({ icon, label, value, color, bgColor }) => (
  <div className="glass-card p-6 rounded-2xl shadow-level-1 flex flex-col gap-4 animate-fade-in-up">
    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${bgColor}`}>
      <span className={`material-symbols-outlined ${color}`} style={{ fontSize: 22 }}>{icon}</span>
    </div>
    <div>
      <p className="text-xs text-[#737686] font-semibold uppercase tracking-wide">{label}</p>
      <p className="font-['Manrope'] text-3xl font-bold text-[#191c1e] mt-1">{value}</p>
    </div>
  </div>
);

const DashboardPage = () => {
  const { user } = useAuth();

  // Tasks state
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [fetchError, setFetchError] = useState('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Modals
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // ── Fetch Tasks ──────────────────────────────────────────────────────────────
  const fetchTasks = useCallback(async () => {
    setLoadingTasks(true);
    setFetchError('');
    try {
      const { data } = await getTasks();
      // Backend should return array of tasks
      setTasks(Array.isArray(data) ? data : data.tasks || []);
    } catch (err) {
      setFetchError('Failed to load tasks. Please try again.');
    } finally {
      setLoadingTasks(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  // ── Filter Logic ─────────────────────────────────────────────────────────────
  useEffect(() => {
    let result = [...tasks];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) => t.title?.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'All') result = result.filter((t) => t.status === statusFilter);
    if (priorityFilter !== 'All') result = result.filter((t) => t.priority === priorityFilter);
    setFilteredTasks(result);
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  // ── Task Counts ───────────────────────────────────────────────────────────────
  const taskCounts = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === 'Pending').length,
    inProgress: tasks.filter((t) => t.status === 'In Progress').length,
    completed: tasks.filter((t) => t.status === 'Completed').length,
  };

  // ── CRUD Handlers ─────────────────────────────────────────────────────────────
  const handleOpenCreate = () => { setSelectedTask(null); setTaskModalOpen(true); };
  const handleOpenEdit = (task) => { setSelectedTask(task); setTaskModalOpen(true); };
  const handleOpenDelete = (task) => { setSelectedTask(task); setDeleteModalOpen(true); };

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
    const message =
      err.response?.data?.message || 'Failed to save task.';

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
    const message =
      err.response?.data?.message || 'Failed to delete task.';

    toast.error(message);
  } finally {
    setModalLoading(false);
  }
};

  const greeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good morning';
    if (hr < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      <Navbar onSearch={setSearchQuery} />
      <Sidebar taskCounts={taskCounts} />

      <main className="lg:ml-[280px] p-6 lg:p-8 max-w-[1440px] transition-all duration-300">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-fade-in-up">
          <div>
            <h1 className="font-['Manrope'] text-3xl font-bold text-[#191c1e] tracking-tight">
              {greeting()}, {user?.name?.split(' ')[0] || 'there'} 👋
            </h1>
            <p className="text-sm text-[#434655] mt-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
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

       {/* Overview Section */}
<section id="overview">
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
    <StatCard
      icon="assessment"
      label="Total Tasks"
      value={taskCounts.total}
      color="text-[#004ac6]"
      bgColor="bg-[#004ac6]/10"
    />

    <StatCard
      icon="pending_actions"
      label="Pending"
      value={taskCounts.pending}
      color="text-[#943700]"
      bgColor="bg-[#943700]/10"
    />

    <StatCard
      icon="sync"
      label="In Progress"
      value={taskCounts.inProgress}
      color="text-[#505f76]"
      bgColor="bg-[#505f76]/10"
    />

    <StatCard
      icon="check_circle"
      label="Completed"
      value={taskCounts.completed}
      color="text-green-600"
      bgColor="bg-green-500/10"
    />
  </div>
</section>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <div className="flex items-center gap-1 bg-white border border-[#c3c6d7] rounded-xl overflow-hidden p-1">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${statusFilter === s ? 'bg-[#004ac6] text-white shadow-sm' : 'text-[#737686] hover:bg-[#f2f4f6]'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto items-center">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 rounded-xl border border-[#c3c6d7] focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/10 outline-none text-sm bg-white text-[#434655]"
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>Priority: {p}</option>
              ))}
            </select>
            <button
              onClick={fetchTasks}
              className="p-2.5 border border-[#c3c6d7] rounded-xl hover:bg-[#eceef0] transition-all"
              title="Refresh tasks"
            >
              <span className="material-symbols-outlined text-[#737686]" style={{ fontSize: 20 }}>refresh</span>
            </button>
          </div>
        </div>

        {/* My Tasks Section */}
<section id="my-tasks">

  {/* Task Grid */}
  {loadingTasks ? (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div
        className="loader"
        style={{
          width: 40,
          height: 40,
          borderWidth: 3,
          borderColor: 'rgba(0,74,198,0.2)',
          borderTopColor: '#004ac6',
        }}
      />
      <p className="text-sm text-[#737686]">Loading tasks...</p>
    </div>
  ) : fetchError ? (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <span
        className="material-symbols-outlined text-[#ba1a1a]"
        style={{ fontSize: 48 }}
      >
        error_outline
      </span>

      <p className="text-sm text-[#737686]">{fetchError}</p>

      <button
        onClick={fetchTasks}
        className="text-sm font-semibold text-[#004ac6] hover:underline"
      >
        Try Again
      </button>
    </div>
  ) : filteredTasks.length === 0 ? (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-20 h-20 bg-[#dbe1ff] rounded-3xl flex items-center justify-center">
        <span
          className="material-symbols-outlined text-[#004ac6]"
          style={{ fontSize: 40 }}
        >
          task
        </span>
      </div>

      <p className="font-['Manrope'] text-lg font-semibold text-[#191c1e]">
        {searchQuery || statusFilter !== 'All' || priorityFilter !== 'All'
          ? 'No tasks match your filters'
          : 'No tasks yet'}
      </p>

      <p className="text-sm text-[#737686]">
        {searchQuery || statusFilter !== 'All'
          ? 'Try adjusting your search or filters.'
          : 'Create your first task to get started!'}
      </p>

      {!searchQuery && statusFilter === 'All' && (
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#004ac6] text-white rounded-xl text-sm font-semibold hover:bg-[#003ea8] transition-colors"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 18 }}
          >
            add
          </span>

          Create First Task
        </button>
      )}
    </div>
  ) : (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
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

</section>

{/* Calendar Section */}
<section id="calendar" className="mt-12">
  <div className="mb-6">
    <h2 className="font-['Manrope'] text-2xl font-bold text-[#191c1e]">
      Calendar
    </h2>
    <p className="text-sm text-[#737686] mt-1">
      Upcoming tasks sorted by due date
    </p>
  </div>

  {tasks.length === 0 ? (
    <div className="bg-white rounded-2xl border border-[#c3c6d7] p-8 text-center">
      <span
        className="material-symbols-outlined text-[#737686]"
        style={{ fontSize: 48 }}
      >
        calendar_month
      </span>

      <p className="mt-4 text-[#737686]">
        No upcoming tasks.
      </p>
    </div>
  ) : (
    <div className="space-y-4">
      {[...tasks]
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .map((task) => (
          <div
            key={task._id}
            className="bg-white rounded-2xl border border-[#c3c6d7] p-5 shadow-level-1"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-[#191c1e]">
                  {task.title}
                </h3>

                <p className="text-sm text-[#737686] mt-1">
                  {task.description}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  task.status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : task.status === "In Progress"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {task.status}
              </span>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-[#737686]">
              <span className="material-symbols-outlined">
                event
              </span>

              {new Date(task.dueDate).toLocaleDateString()}
            </div>
          </div>
        ))}
    </div>
  )}
</section>

</main>
      {/* Floating Action Button (Mobile) */}
      <button
        onClick={handleOpenCreate}
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#004ac6] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[60] lg:hidden"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 28 }}>add</span>
      </button>

      {/* Modals */}
      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSubmit={handleSubmitTask}
        task={selectedTask}
        loading={modalLoading}
      />
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        task={selectedTask}
        loading={modalLoading}
      />
    </div>
  );
};

export default DashboardPage;
