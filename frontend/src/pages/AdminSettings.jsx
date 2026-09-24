import { useState } from 'react';
import api from '../utils/api';

const AdminSettings = () => {
  const [formData, setFormData] = useState({
    newUsername: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const derivedConfig = {
    appName: 'Registry Console',
    version: '2.5.0',
    environment: 'production',
    lastBackup: '2026-09-01',
    sshKeyStatus: 'active (simulated)',
    apiEndpoint: '/api',
    debugMode: false,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = formData.newUsername.trim();
    const password = formData.newPassword;
    const confirm = formData.confirmPassword;

    setMessage('');
    setError('');

    if (username && username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    if (password && password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    if (password && password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setSubmitting(true);
    try {
      await api.put('/admin/settings', {
        newUsername: username || undefined,
        newPassword: password || undefined,
      });
      setMessage('Settings saved');
      setFormData({ newUsername: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save settings');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section aria-labelledby="console-settings">
      <header className="border-b border-rule pb-6">
        <p className="file-index-sm">CONSOLE – BK / CONFIG</p>
        <h2
          id="console-settings"
          className="mt-1 text-heading font-semibold text-ink"
        >
          Settings
        </h2>
      </header>

      <form onSubmit={handleSubmit} className="mt-8 max-w-2xl">
        {(message || error) && (
          <p
            className={`mb-5 border px-4 py-2.5 font-mono text-[13px] ${
              error
                ? 'border-stamp text-stamp'
                : 'border-registry text-registry'
            }`}
          >
            {error || message}
          </p>
        )}

        <div className="border-b border-rule pb-6">
          <h3 className="text-title font-semibold text-ink">Change username</h3>
          <div className="mt-3">
            <label
              className="mb-1 block font-mono text-[12px] uppercase tracking-[0.08em] text-ink-muted"
              htmlFor="s-username"
            >
              New username
            </label>
            <input
              id="s-username"
              type="text"
              name="newUsername"
              value={formData.newUsername}
              onChange={handleChange}
              className="input-base"
              placeholder="Enter new username"
            />
            <p className="file-index-sm mt-1.5">
              Leave empty to keep the current username.
            </p>
          </div>
        </div>

        <div className="border-b border-rule py-6">
          <h3 className="text-title font-semibold text-ink">Change password</h3>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                className="mb-1 block font-mono text-[12px] uppercase tracking-[0.08em] text-ink-muted"
                htmlFor="s-password"
              >
                New password
              </label>
              <input
                id="s-password"
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="input-base"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label
                className="mb-1 block font-mono text-[12px] uppercase tracking-[0.08em] text-ink-muted"
                htmlFor="s-confirm"
              >
                Confirm password
              </label>
              <input
                id="s-confirm"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-base"
                placeholder="Confirm new password"
              />
            </div>
          </div>
          <p className="file-index-sm mt-1.5">
            Leave both password fields empty to keep the current password.
          </p>
        </div>

        <div className="border-b border-rule py-6">
          <h3 className="text-title font-semibold text-ink">
            Console configuration
          </h3>
          <p className="file-index-sm mt-1">Derived live values (no secrets).</p>
          <pre className="mt-4 overflow-x-auto border border-rule bg-paper-strong p-4 font-mono text-[12.5px] leading-relaxed text-ink">
{JSON.stringify(derivedConfig, null, 2)}
          </pre>
        </div>

        <div className="mt-6">
          <button type="submit" disabled={submitting} className="btn btn-primary">
            {submitting ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AdminSettings;