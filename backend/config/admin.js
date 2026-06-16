// Demo-only in-memory admin credentials.
// In production, persist a password hash in a database and load credentials from environment variables.

const bcrypt = require('bcryptjs');

let adminUsername = 'admin';
let adminPasswordHash = bcrypt.hashSync('admin123', 10);

module.exports = {
  getUsername: () => adminUsername,
  getPasswordHash: () => adminPasswordHash,
  setUsername: (value) => {
    adminUsername = value.trim();
  },
  setPassword: async (value) => {
    adminPasswordHash = await bcrypt.hash(value, 10);
  },
  verifyPassword: async (value) => bcrypt.compare(value, adminPasswordHash)
};
