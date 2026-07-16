import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { register } from '../services/authService';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      const message = 'Passwords do not match.';
      setError(message);
      toast.error(message);
      return;
    }

    if (form.password.length < 6) {
      const message = 'Password must be at least 6 characters.';
      setError(message);
      toast.error(message);
      return;
    }

    setLoading(true);

    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      // Clear form
      setForm({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });

      // Success toast
      toast.success('Registration successful! Please login.');

      // Redirect after short delay
      setTimeout(() => {
        navigate('/login');
      }, 1200);

    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Registration failed. Please try again.';

      setError(message);
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
          'radial-gradient(circle at 100% 0%, rgba(37,99,235,0.04) 0%, transparent 50%), radial-gradient(circle at 0% 100%, rgba(37,99,235,0.04) 0%, transparent 50%)',
        backgroundColor: '#f7f9fb',
      }}
    >
      <main className="w-full max-w-md animate-fade-in-up">
        {/* Brand */}
        <div className="flex flex-col items-center mb-10 space-y-3">
          <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-white shadow-level-1 border border-[#c3c6d7]">
            <span
              className="material-symbols-outlined text-[#004ac6]"
              style={{ fontSize: 32 }}
            >
              task_alt
            </span>
          </div>

          <h1 className="font-['Manrope'] text-3xl font-bold text-[#191c1e] tracking-tight">
            Create Account
          </h1>

          <p className="text-sm text-[#434655] text-center max-w-[280px] leading-relaxed">
            Join TaskFlow and start managing your projects efficiently.
          </p>
        </div>

        {/* Card */}
        <section
          className="rounded-2xl p-8 lg:p-10 login-card-shadow"
          style={{
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.6)',
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">

            {error && (
              <div className="flex items-start gap-3 bg-[#ffdad6] text-[#93000a] p-4 rounded-xl">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 20 }}
                >
                  report
                </span>

                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="block text-xs font-semibold text-[#434655] uppercase tracking-wide"
              >
                Full Name
              </label>

              <div className="relative">
                <span
                  className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#737686]"
                >
                  person
                </span>

                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-3 bg-white border border-[#c3c6d7] rounded-xl focus:ring-4 focus:ring-[#004ac6]/10 focus:border-[#004ac6] outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-[#434655] uppercase tracking-wide"
              >
                Email Address
              </label>

              <div className="relative">
                <span
                  className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#737686]"
                >
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
                  className="w-full pl-12 pr-4 py-3 bg-white border border-[#c3c6d7] rounded-xl focus:ring-4 focus:ring-[#004ac6]/10 focus:border-[#004ac6] outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-[#434655] uppercase tracking-wide"
              >
                Password
              </label>

              <div className="relative">
                <span
                  className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#737686]"
                >
                  lock
                </span>

                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-12 pr-12 py-3 bg-white border border-[#c3c6d7] rounded-xl focus:ring-4 focus:ring-[#004ac6]/10 focus:border-[#004ac6] outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-semibold text-[#434655] uppercase tracking-wide"
              >
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                required
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className="w-full px-4 py-3 bg-white border border-[#c3c6d7] rounded-xl focus:ring-4 focus:ring-[#004ac6]/10 focus:border-[#004ac6] outline-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#004ac6] text-white rounded-xl font-semibold hover:bg-[#003ea8] transition-all disabled:opacity-70"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

          </form>

          <div className="mt-8 pt-6 border-t border-[#c3c6d7] text-center">
            <p className="text-sm text-[#434655]">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-[#004ac6] hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default RegisterPage;