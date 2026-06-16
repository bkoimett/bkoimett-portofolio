export function getAdminToken() {
  return localStorage.getItem('adminToken');
}

export function logout() {
  localStorage.removeItem('adminToken');
}

export function isAdminLoggedIn() {
  return !!getAdminToken();
}
