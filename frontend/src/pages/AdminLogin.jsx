import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import SEO from '../components/SEO';
import { useAuth } from '../context/authContext';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError('');
    setLoading(true);

    try {
      const loginPayload = {
        username: username.trim(),
        password: password.trim(),
      };

      const response = await api.post('/admin/login', loginPayload);

      login(response.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SEO title="Registry sign in" noindex />
      <header className="border-b border-rule border-t-[3px] border-t-registry bg-paper">
        <div className="flex h-14 items-center justify-between px-gutter">
          <Link
            to="/"
            className="flex items-baseline gap-2 font-serif text-[17px] font-semibold text-ink"
          >
            Registry Console
            <span className="file-index-sm hidden sm:inline">// SIGN IN</span>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-gutter py-16">
        <section className="w-full max-w-[430px] border border-rule bg-paper">
          <header className="border-b border-rule px-7 py-5">
            <p className="file-index-sm">AUTHORISED PERSONNEL ONLY</p>
            <h1 className="mt-1 text-heading font-semibold text-ink">
              Registry sign in
            </h1>
            <p className="mt-1 text-body-sm text-ink-muted">
              Enter your credentials to open the console.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="px-7 py-6">
            {error && (
              <p className="mb-5 border border-stamp px-4 py-2.5 font-mono text-[13px] text-stamp">
                {error}
              </p>
            )}

            <div className="mb-4">
              <label
                className="mb-1 block font-mono text-[12px] uppercase tracking-[0.08em] text-ink-muted"
                htmlFor="login-username"
              >
                Username
              </label>
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="input-base"
                placeholder="admin"
              />
            </div>

            <div className="mb-6">
              <label
                className="mb-1 block font-mono text-[12px] uppercase tracking-[0.08em] text-ink-muted"
                htmlFor="login-password"
              >
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="input-base"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <footer className="flex items-center justify-between border-t border-rule px-7 py-4">
            <Link
              to="/"
              className="font-mono text-[12px] uppercase tracking-[0.08em] text-ink-muted hover:text-registry"
            >
              ← Back to site
            </Link>
            <span className="file-index-sm">System v2.5.0</span>
          </footer>
        </section>
      </main>
    </div>
  );
}