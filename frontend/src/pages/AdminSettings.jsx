import { useState } from 'react';
import api from '../utils/api';

const AdminSettings = () => {
  const [formData, setFormData] = useState({
    newUsername: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const trimmedUsername = formData.newUsername.trim();
    const newPassword = formData.newPassword;
    const confirmPassword = formData.confirmPassword;

    if (trimmedUsername && trimmedUsername.length < 3) {
      setError('Username must be at least 3 characters long');
      setLoading(false);
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      await api.put('/admin/settings', {
        newUsername: trimmedUsername || undefined,
        newPassword: newPassword || undefined
      });

      setMessage('Settings updated successfully');
      setFormData({
        newUsername: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const derivedConfig = {
    appName: 'benjieDev Console',
    version: '2.4.0',
    environment: 'production',
    lastBackup: '2024-01-15',
    sshKeyStatus: 'active (simulated)',
    apiEndpoint: '/api',
    debugMode: false
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>

      <form onSubmit={handleSubmit} className="settings-form">
        <div className="form-section">
          <h3>Change Username</h3>
          <div className="form-group">
            <label>New Username</label>
            <input
              type="text"
              name="newUsername"
              value={formData.newUsername}
              onChange={handleInputChange}
              placeholder="Enter new username"
            />
            <small>Leave empty to keep current username</small>
          </div>
        </div>

        <div className="form-section">
          <h3>Change Password</h3>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              placeholder="Enter new password"
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm new password"
            />
            <small>Leave both password fields empty to keep current password</small>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        <div className="form-section">
          <h3>Raw Configuration Viewer</h3>
          <div className="code-panel rounded-lg p-4 mt-4 bg-surface-container-low border border-outline-variant/30">
            <pre className="font-code-sm text-code-sm text-on-surface">
<code>
{JSON.stringify(derivedConfig, null, 2)}
</code>
</pre>
          </div>
        </div>

        <div className="form-section mt-6">
          <button type="submit" disabled={loading} className="save-btn">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;