import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError('');
    setLoading(true);

    try {
      const loginPayload = {
        username: username.trim(),
        password: password.trim()
      };

      const response = await api.post('/admin/login', loginPayload);

      localStorage.setItem('adminToken', response.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      {/* Atmospheric Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-accent/5 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-surface/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Login Container */}
      <main className="relative z-10 w-full max-w-[420px]">
        {/* Back Link */}
        <Link className="group inline-flex items-center gap-2 mb-6 font-label-md text-muted hover:text-accent transition-colors" to="/">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Home</span>
        </Link>

        {/* Login Card */}
        <div className="card rounded-xl p-8 w-full">
          <div className="mb-6">
            <h1 className="font-headline-lg text-ink mb-2">Admin Login</h1>
            <p className="text-muted">Access the technical console.</p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            {/* Error Message */}
            <div className={`bg-error-container/20 border border-error/30 rounded-lg p-4 flex items-center gap-2 animate-pulse ${error ? '' : 'hidden'}`} id="errorMessage">
              <span className="material-symbols-outlined text-error text-[20px]">error</span>
              <span className="font-label-md text-label-md text-error">{error}</span>
            </div>

            {/* Username */}
            <div className="space-y-1">
              <label className="font-label-md text-label-md text-muted" htmlFor="username">Username</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-border text-[20px]">person</span>
                <input className="w-full h-12 bg-surface/50 border border-border rounded-lg pl-12 pr-4 font-code-sm text-code-sm text-on-surface placeholder:text-border focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all" id="username" placeholder="admin_id" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="font-label-md text-label-md text-muted" htmlFor="password">Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-border text-[20px]">lock</span>
                <input className="w-full h-12 bg-surface/50 border border-border rounded-lg pl-12 pr-4 font-code-sm text-code-sm text-on-surface placeholder:text-border focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all" id="password" placeholder="••••••••" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>

            {/* Submit Button */}
            <button className="mt-4 w-full h-12 bg-accent text-on-accent rounded-lg font-headline-md text-[16px] rounded-lg flex items-center justify-center gap-3 transition-all active:scale-95 group" type="submit" disabled={loading}>
              <span id="btnText">Sign In</span>
              <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform" id="btnIcon">login</span>
            </button>
          </form>

          {/* Footer Text */}
          <div className="mt-8 pt-8 border-t border-border/20 flex flex-col items-center gap-2">
            <span className="font-label-md text-label-md text-outline">System v2.4.0 (MERN & Go)</span>
            <div className="flex gap-4">
              <a className="text-outline hover:text-on-surface transition-colors font-label-md text-label-md" href="/about">About</a>
              <a className="text-outline hover:text-on-surface transition-colors font-label-md text-label-md" href="/projects">Projects</a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}