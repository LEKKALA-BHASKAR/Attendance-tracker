import { getUsers } from './storage';

export const authenticateUser = (username, password) => {
  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === password);
  return user || null;
};

export const userExists = (username) => {
  const users = getUsers();
  return users.some(u => u.username === username);
};

export const getDepartments = () => [
  'Computer Science',
  'Information Technology',
  'Electronics',
  'Mechanical',
  'Civil',
  'Electrical',
  'Chemical',
  'Biotechnology',
  'Other'
];
