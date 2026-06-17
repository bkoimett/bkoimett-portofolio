import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

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

      const apiUrl = import.meta.env.VITE_API_URL || '/api';

      console.log('[admin-login] Sending credentials:', {
        ...loginPayload,
        password: '[redacted]',
        passwordLength: loginPayload.password.length,
        endpoint: `${apiUrl}/api/admin/login`
      });

      const response = await axios.post(`${apiUrl}/api/admin/login`, loginPayload);

      console.log('[admin-login] Login response:', response.data);

      localStorage.setItem('adminToken', response.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      console.log('[admin-login] Login error:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-stack-lg">
      {/* Atmospheric Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-secondary-container/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Login Container */}
      <main className="relative z-10 w-full max-w-[400px]">
        {/* Back Link */}
        <Link className="group inline-flex items-center gap-stack-sm mb-stack-lg font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" to="/">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Home</span>
        </Link>

        {/* Login Card */}
        <div className="glass-panel rounded-xl p-stack-lg w-full">
          <div className="mb-stack-lg">
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">Admin Login</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Access the technical console.</p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-stack-md" onSubmit={handleSubmit}>
            {/* Error Message (Hidden by default) */}
            <div className={`bg-error-container/20 border border-error/30 rounded-lg p-stack-sm flex items-center gap-stack-sm animate-pulse ${error ? '' : 'hidden'}`} id="errorMessage">
              <span className="material-symbols-outlined text-error text-[20px]">error</span>
              <span className="font-label-md text-label-md text-error">{error}</span>
            </div>

            {/* Username */}
            <div className="space-y-1">
              <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="username">Username</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">person</span>
                <input className="w-full h-12 bg-surface-container-low border border-outline-variant rounded-lg pl-12 pr-4 font-code-sm text-code-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" id="username" placeholder="admin_id" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="password">Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">lock</span>
                <input className="w-full h-12 bg-surface-container-low border border-outline-variant rounded-lg pl-12 pr-4 font-code-sm text-code-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" id="password" placeholder="••••••••" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-stack-sm mt-1">
              <input className="w-4 h-4 rounded border-outline-variant bg-surface-container-low text-primary focus:ring-primary focus:ring-offset-surface-container-low" id="remember" type="checkbox" />
              <label className="font-label-md text-label-md text-on-surface-variant cursor-pointer select-none" htmlFor="remember">Remember me</label>
            </div>

            {/* Submit Button */}
            <button className="mt-stack-sm w-full h-12 bg-primary-container hover:bg-primary-container/90 text-on-primary-container font-headline-md text-[16px] rounded-lg flex items-center justify-center gap-stack-sm transition-all active:scale-95 group" type="submit" disabled={loading}>
              <span id="btnText">Sign In</span>
              <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform" id="btnIcon">login</span>
            </button>
          </form>

          {/* Footer Text */}
          <div className="mt-stack-lg pt-stack-lg border-t border-outline-variant/30 flex flex-col items-center gap-2">
            <span className="font-label-md text-label-md text-outline">System v2.4.0 (MERN & Go)</span>
            <div className="flex gap-4">
              <a className="text-outline hover:text-on-surface transition-colors font-label-md text-label-md" href="#">Privacy</a>
              <a className="text-outline hover:text-on-surface transition-colors font-label-md text-label-md" href="#">Security</a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
