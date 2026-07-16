import { Link, useLocation } from "react-router-dom";

const navItems = [
  {
    icon: "dashboard",
    label: "Overview",
    path: "/dashboard",
  },
  {
    icon: "assignment",
    label: "My Tasks",
    path: "/my-tasks",
  },
  {
    icon: "calendar_month",
    label: "Calendar",
    path: "/calendar",
  },
];

const Sidebar = ({ taskCounts = {} }) => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-[280px] hidden lg:flex flex-col bg-[#f2f4f6] border-r border-[#c3c6d7] p-4 gap-2 z-40">
      {/* Workspace */}
      <div className="mb-4 px-2">
        <h2 className="font-['Manrope'] text-xl font-bold text-[#004ac6]">
          Project Workspace
        </h2>
        <p className="text-xs text-[#737686] mt-0.5">
          Personal Plan
        </p>
      </div>

      {/* Navigation */}
      <div className="space-y-1 flex-grow">
        {navItems.map((item) => {
          const active = location.pathname === item.path;

          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                active
                  ? "bg-[#004ac6] text-white shadow-md"
                  : "text-[#434655] hover:bg-[#e0e3e5] hover:text-[#004ac6]"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: 22,
                  fontVariationSettings: active
                    ? "'FILL' 1"
                    : "'FILL' 0",
                }}
              >
                {item.icon}
              </span>

              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Stats Summary */}
      <div className="mb-4 px-2">
        <div className="bg-white rounded-xl p-4 shadow-level-1 space-y-3">
          <div className="flex justify-between">
            <span className="text-xs text-[#737686]">Total</span>
            <span className="font-bold text-[#004ac6]">
              {taskCounts.total ?? 0}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-xs text-[#737686]">Pending</span>
            <span className="font-bold text-[#943700]">
              {taskCounts.pending ?? 0}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-xs text-[#737686]">In Progress</span>
            <span className="font-bold text-[#505f76]">
              {taskCounts.inProgress ?? 0}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-xs text-[#737686]">Completed</span>
            <span className="font-bold text-green-600">
              {taskCounts.completed ?? 0}
            </span>
          </div>
        </div>
      </div>

      {/* TaskFlow Info Card */}
<div className="bg-gradient-to-br from-[#004ac6] to-[#2563eb] rounded-2xl p-5 text-white shadow-level-2 mb-2">

  <div className="flex items-center gap-3 mb-4">
    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
      <span
        className="material-symbols-outlined"
        style={{ fontSize: 26 }}
      >
        task_alt
      </span>
    </div>

    <div>
      <h3 className="font-['Manrope'] text-lg font-bold">
        TaskFlow
      </h3>

      <p className="text-xs text-blue-100">
        Smart Task Management
      </p>
    </div>
  </div>

  <p className="text-sm text-blue-50 leading-relaxed mb-5">
    Organize your work, manage deadlines, and boost productivity with a clean and efficient workflow.
  </p>

  <div className="flex items-center justify-between border-t border-white/20 pt-4">
    <div>
      <p className="text-[11px] uppercase tracking-wide text-blue-100">
        Version
      </p>

      <p className="text-sm font-semibold">
        v1.0
      </p>
    </div>

    <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold">
      MERN Stack
    </span>
  </div>

</div>
    </aside>
  );
};

export default Sidebar;