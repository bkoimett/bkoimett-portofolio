import { useState } from 'react';
import axios from 'axios';
import { getAdminToken } from '../utils/auth';
import '../styles/AdminSettings.css';

export default function AdminSettings() {
  const token = getAdminToken();
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

  const apiUrl = import.meta.env.VITE_API_URL || '/api';

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
      await axios.put(
        `${apiUrl}/api/admin/settings`,
        {
          newUsername: trimmedUsername || undefined,
          newPassword: newPassword || undefined
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

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

        <button type="submit" disabled={loading} className="save-btn">
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
