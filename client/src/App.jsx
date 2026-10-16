import { useState } from 'react';
import AuthForm from './AuthForm.jsx';
import TaskBoard from './TaskBoard.jsx';

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });

  const handleAuth = ({ token, user }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return user ? <TaskBoard user={user} onLogout={logout} /> : <AuthForm onAuth={handleAuth} />;
}
