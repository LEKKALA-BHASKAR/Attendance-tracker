const USERS_KEY = 'app_users';
const CURRENT_USER_KEY = 'current_user';

const getDefaultUsers = () => [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    createdAt: new Date().toISOString()
  }
];

export const getUsers = () => {
  const users = localStorage.getItem(USERS_KEY);
  if (!users) {
    const defaultUsers = getDefaultUsers();
    saveUsers(defaultUsers);
    return defaultUsers;
  }
  return JSON.parse(users);
};

export const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const addUser = (user) => {
  const users = getUsers();
  const newUser = {
    ...user,
    id: Math.max(0, ...users.map(u => u.id)) + 1,
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
};

export const deleteUser = (userId) => {
  const users = getUsers();
  const filteredUsers = users.filter(user => user.id !== userId);
  saveUsers(filteredUsers);
};

export const getCurrentUser = () => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user) => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

export const clearCurrentUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};
