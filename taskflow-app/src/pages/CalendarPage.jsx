import { useState, useEffect, useCallback } from 'react';
import { getTasks } from '../services/taskService';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Returns a plain YYYY-MM-DD string for a Date in local time.
 */
const toLocalDateStr = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const todayStr = toLocalDateStr(new Date());
const tomorrowStr = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return toLocalDateStr(d);
})();

/** Bucket a task by its due date relative to today. */
const getBucket = (task) => {
  if (!task.dueDate) return 'upcoming';
  const due = task.dueDate.split('T')[0]; // "YYYY-MM-DD"
  if (due < todayStr) return 'overdue';
  if (due === todayStr) return 'today';
  if (due === tomorrowStr) return 'tomorrow';
  return 'upcoming';
};

/** Format a due-date ISO string nicely. */
const formatDate = (iso) => {
  if (!iso) return 'No due date';
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// ── Sub-components ────────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const map = {
    Pending: 'bg-[#ffede6] text-[#943700]',
    'In Progress': 'bg-[#d0e1fb] text-[#505f76]',
    Completed: 'bg-green-100 text-green-700',
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        map[status] || 'bg-[#eceef0] text-[#737686]'
      }`}
    >
      {status}
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  const map = {
    High: 'text-red-600',
    Medium: 'text-amber-600',
    Low: 'text-green-600',
  };
  if (!priority) return null;
  return (
    <span className={`text-xs font-semibold ${map[priority] || 'text-[#737686]'}`}>
      ● {priority}
    </span>
  );
};

const CalendarTaskCard = ({ task }) => (
  <div className="group bg-white rounded-2xl border border-transparent shadow-level-1 hover:border-[#004ac6]/20 hover:-translate-y-0.5 transition-all duration-300 p-5">
    {/* Top row: badges */}
    <div className="flex items-center gap-2 flex-wrap mb-3">
      <StatusBadge status={task.status} />
      <PriorityBadge priority={task.priority} />
      {task.category && (
        <span className="text-xs text-[#737686] bg-[#eceef0] px-2 py-0.5 rounded-full">
          {task.category}
        </span>
      )}
    </div>

    {/* Title */}
    <h3 className="font-['Manrope'] text-base font-semibold text-[#191c1e] group-hover:text-[#004ac6] transition-colors leading-snug mb-1">
      {task.title}
    </h3>

    {/* Description */}
    {task.description && (
      <p className="text-sm text-[#434655] line-clamp-2 leading-relaxed mb-3">
        {task.description}
      </p>
    )}

    {/* Progress bar (In Progress tasks only) */}
    {task.status === 'In Progress' && typeof task.progress === 'number' && (
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1 bg-[#eceef0] h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-[#004ac6] h-full rounded-full transition-all"
            style={{ width: `${task.progress}%` }}
          />
        </div>
        <span className="text-xs font-semibold text-[#004ac6]">{task.progress}%</span>
      </div>
    )}

    {/* Due date footer */}
    <div className="flex items-center gap-1.5 text-xs text-[#737686] pt-3 border-t border-[#eceef0]">
      <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
        calendar_today
      </span>
      <span className="font-medium">{formatDate(task.dueDate)}</span>
    </div>
  </div>
);

/** A labelled section with a coloured left-border accent and task count chip. */
const GroupSection = ({ icon, title, accentColor, chipClass, tasks }) => {
  if (tasks.length === 0) return null;

  return (
    <section className="animate-fade-in-up">
      {/* Group heading */}
      <div className={`flex items-center gap-3 mb-4 pl-4 border-l-4 ${accentColor}`}>
        <span
          className="material-symbols-outlined"
          style={{ fontSize: 22, color: 'inherit' }}
        >
          {icon}
        </span>
        <h2 className="font-['Manrope'] text-lg font-bold text-[#191c1e]">{title}</h2>
        <span
          className={`ml-auto text-xs font-semibold px-2.5 py-0.5 rounded-full ${chipClass}`}
        >
          {tasks.length}
        </span>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {tasks.map((task) => (
          <CalendarTaskCard key={task._id} task={task} />
        ))}
      </div>
    </section>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────

const CalendarPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getTasks();
      setTasks(Array.isArray(data) ? data : data.tasks || []);
    } catch {
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  // ── Bucket & sort tasks ──────────────────────────────────────────────────────
  const byDate = (a, b) => new Date(a.dueDate || 0) - new Date(b.dueDate || 0);

  const overdue  = tasks.filter((t) => getBucket(t) === 'overdue').sort(byDate);
  const today    = tasks.filter((t) => getBucket(t) === 'today').sort(byDate);
  const tomorrow = tasks.filter((t) => getBucket(t) === 'tomorrow').sort(byDate);
  const upcoming = tasks.filter((t) => getBucket(t) === 'upcoming').sort(byDate);

  const hasAny = overdue.length + today.length + tomorrow.length + upcoming.length > 0;

  // ── Task counts for Sidebar ──────────────────────────────────────────────────
  const taskCounts = {
    total:      tasks.length,
    pending:    tasks.filter((t) => t.status === 'Pending').length,
    inProgress: tasks.filter((t) => t.status === 'In Progress').length,
    completed:  tasks.filter((t) => t.status === 'Completed').length,
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      <Navbar />
      <Sidebar taskCounts={taskCounts} />

      <main className="lg:ml-[280px] p-6 lg:p-8 max-w-[1440px] transition-all duration-300">

        {/* ── Page Header ───────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 animate-fade-in-up">
          <div>
            <h1 className="font-['Manrope'] text-3xl font-bold text-[#191c1e] tracking-tight">
              Calendar
            </h1>
            <p className="text-sm text-[#737686] mt-1">
              {loading
                ? 'Fetching your tasks…'
                : `${tasks.length} task${tasks.length !== 1 ? 's' : ''} sorted by due date`}
            </p>
          </div>

          {/* Refresh */}
          <button
            onClick={fetchTasks}
            className="flex items-center gap-2 px-4 py-2.5 border border-[#c3c6d7] rounded-xl text-sm font-semibold text-[#434655] hover:bg-[#eceef0] transition-all"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>refresh</span>
            Refresh
          </button>
        </div>

        {/* ── Today's date strip ────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 mb-8 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
          <div className="w-10 h-10 bg-[#004ac6] rounded-xl flex flex-col items-center justify-center text-white leading-none select-none">
            <span className="text-[10px] font-semibold uppercase tracking-wider">
              {new Date().toLocaleDateString('en-US', { month: 'short' })}
            </span>
            <span className="text-lg font-extrabold font-['Manrope']">
              {new Date().getDate()}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#191c1e]">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p className="text-xs text-[#737686]">
              {today.length > 0
                ? `${today.length} task${today.length !== 1 ? 's' : ''} due today`
                : 'No tasks due today'}
            </p>
          </div>
        </div>

        {/* ── States ───────────────────────────────────────────────────────── */}
        {loading ? (
          /* Loading */
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
            <p className="text-sm text-[#737686] font-medium">Loading calendar…</p>
          </div>

        ) : error ? (
          /* Error */
          <div className="flex flex-col items-center justify-center py-32 gap-4 animate-fade-in-up">
            <div className="w-20 h-20 bg-[#ffdad6] rounded-3xl flex items-center justify-center">
              <span className="material-symbols-outlined text-[#ba1a1a]" style={{ fontSize: 40 }}>
                error_outline
              </span>
            </div>
            <p className="font-['Manrope'] text-lg font-semibold text-[#191c1e]">
              Something went wrong
            </p>
            <p className="text-sm text-[#737686]">{error}</p>
            <button
              onClick={fetchTasks}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#004ac6] text-white rounded-xl text-sm font-semibold hover:bg-[#003ea8] transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>refresh</span>
              Try Again
            </button>
          </div>

        ) : !hasAny ? (
          /* Empty */
          <div className="flex flex-col items-center justify-center py-32 gap-4 animate-fade-in-up">
            <div className="w-20 h-20 bg-[#dbe1ff] rounded-3xl flex items-center justify-center">
              <span className="material-symbols-outlined text-[#004ac6]" style={{ fontSize: 40 }}>
                calendar_month
              </span>
            </div>
            <p className="font-['Manrope'] text-lg font-semibold text-[#191c1e]">
              Your calendar is clear
            </p>
            <p className="text-sm text-[#737686] text-center max-w-xs">
              You have no tasks with due dates yet. Create tasks from the Dashboard or My Tasks page.
            </p>
          </div>

        ) : (
          /* Grouped task sections */
          <div className="space-y-10">

            {/* Overdue */}
            <GroupSection
              icon="warning"
              title="Overdue"
              accentColor="border-[#ba1a1a]"
              chipClass="bg-[#ffdad6] text-[#ba1a1a]"
              tasks={overdue}
            />

            {/* Today */}
            <GroupSection
              icon="today"
              title="Today"
              accentColor="border-[#004ac6]"
              chipClass="bg-[#dbe1ff] text-[#004ac6]"
              tasks={today}
            />

            {/* Tomorrow */}
            <GroupSection
              icon="event"
              title="Tomorrow"
              accentColor="border-[#505f76]"
              chipClass="bg-[#d0e1fb] text-[#505f76]"
              tasks={tomorrow}
            />

            {/* Upcoming */}
            <GroupSection
              icon="date_range"
              title="Upcoming"
              accentColor="border-green-500"
              chipClass="bg-green-100 text-green-700"
              tasks={upcoming}
            />

          </div>
        )}
      </main>
    </div>
  );
};

export default CalendarPage;
