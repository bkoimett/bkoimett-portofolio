// For now, we'll use a hardcoded admin (later can use database).
// In production, store password hash in database and load credentials from environment variables.

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123'; // Change this to something secure.

module.exports = {
  ADMIN_USERNAME,
  ADMIN_PASSWORD
};
