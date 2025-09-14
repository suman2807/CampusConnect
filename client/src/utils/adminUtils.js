// Admin utility functions
export const ADMIN_EMAILS = ['suman_saurabh@srmap.edu.in'];

export const isAdminUser = (user) => {
  if (!user?.primaryEmailAddress?.emailAddress) return false;
  return ADMIN_EMAILS.includes(user.primaryEmailAddress.emailAddress);
};

export const hasAdminAccess = (user) => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  return isAdmin && isAdminUser(user);
};

export const setAdminSession = () => {
  localStorage.setItem('isAdmin', 'true');
};

export const clearAdminSession = () => {
  localStorage.removeItem('isAdmin');
};
