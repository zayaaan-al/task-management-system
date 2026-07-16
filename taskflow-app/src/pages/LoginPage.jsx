import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
  e.preventDefault();

  setError('');
  setLoading(true);

  try {
    const { data } = await login(form);

    // Save JWT and user
    loginUser(data.token, data.user);

    // Success Toast
    toast.success(`Welcome back, ${data.user.name}! 👋`);

    // Redirect after a short delay
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);

  } catch (err) {
    const message =
      err.response?.data?.message ||
      'Invalid email or password. Please try again.';

    setError(message);

    // Error Toast
    toast.error(message);

  } finally {
    setLoading(false);
  }
};
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 lg:p-12"
      style={{
        backgroundImage:
          'radial-gradient(circle at 0% 0%, rgba(37,99,235,0.04) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(37,99,235,0.04) 0%, transparent 50%)',
        backgroundColor: '#f7f9fb',
      }}
    >
      <main className="w-full max-w-md animate-fade-in-up">
        {/* Brand */}
        <div className="flex flex-col items-center mb-10 space-y-3">
          <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-white shadow-level-1 border border-[#c3c6d7]">
            <span className="material-symbols-outlined text-[#004ac6]" style={{ fontSize: 32 }}>task_alt</span>
          </div>
          <h1 className="font-['Manrope'] text-3xl font-bold text-[#191c1e] tracking-tight">TaskFlow</h1>
          <p className="text-sm text-[#434655] text-center max-w-[280px] leading-relaxed">
            Enter your details to manage your workspace and productivity.
          </p>
        </div>

        {/* Card */}
        <section
          className="rounded-2xl p-8 lg:p-10 login-card-shadow"
          style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.6)' }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 bg-[#ffdad6] text-[#93000a] p-4 rounded-xl animate-slide-in">
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>report</span>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#434655] uppercase tracking-wide" htmlFor="email">
                Email Address
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#737686] group-focus-within:text-[#004ac6] transition-colors" style={{ fontSize: 20 }}>
                  mail
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className="w-full pl-12 pr-4 py-3 bg-white border border-[#c3c6d7] rounded-xl focus:ring-4 focus:ring-[#004ac6]/10 focus:border-[#004ac6] outline-none transition-all text-sm placeholder:text-[#737686]/50"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-semibold text-[#434655] uppercase tracking-wide" htmlFor="password">
                  Password
                </label>
                <a href="#" className="text-xs font-semibold text-[#004ac6] hover:underline">Forgot password?</a>
              </div>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#737686] group-focus-within:text-[#004ac6] transition-colors" style={{ fontSize: 20 }}>
                  lock
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 bg-white border border-[#c3c6d7] rounded-xl focus:ring-4 focus:ring-[#004ac6]/10 focus:border-[#004ac6] outline-none transition-all text-sm placeholder:text-[#737686]/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#737686] hover:text-[#191c1e] transition-colors focus:outline-none"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#004ac6] text-white font-semibold rounded-xl shadow-lg shadow-[#004ac6]/20 hover:bg-[#003ea8] hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
            >
              {loading ? <div className="loader" /> : null}
              {loading ? 'Signing in...' : 'Sign In to Workspace'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#c3c6d7] text-center">
            <p className="text-sm text-[#434655]">
              New to TaskFlow?{' '}
              <Link to="/register" className="font-semibold text-[#004ac6] hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </section>

        <footer className="mt-8 flex justify-center gap-6">
          <a href="#" className="text-xs text-[#737686] hover:text-[#434655] transition-colors">Privacy Policy</a>
          <span className="w-1 h-1 rounded-full bg-[#c3c6d7] self-center" />
          <a href="#" className="text-xs text-[#737686] hover:text-[#434655] transition-colors">Terms of Service</a>
          <span className="w-1 h-1 rounded-full bg-[#c3c6d7] self-center" />
          <a href="#" className="text-xs text-[#737686] hover:text-[#434655] transition-colors">Support</a>
        </footer>
      </main>
    </div>
  );
};

export default LoginPage;
