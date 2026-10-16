import { useState } from 'react';
import { api } from './api.js';

export default function AuthForm({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const data = mode === 'login' ? await api.login(form) : await api.register(form);
      onAuth(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="auth">
      <h1>Taskboard</h1>
      <p className="lede">Keep what you need to do in one place.</p>
      <form onSubmit={submit} className="card">
        {mode === 'register' && (
          <label>Name<input value={form.name} onChange={set('name')} required /></label>
        )}
        <label>Email<input type="email" value={form.email} onChange={set('email')} required /></label>
        <label>Password<input type="password" minLength={6} value={form.password} onChange={set('password')} required /></label>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="primary" disabled={busy}>
          {mode === 'login' ? 'Log in' : 'Create account'}
        </button>
      </form>
      <button className="link" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
        {mode === 'login' ? 'New here? Create an account' : 'Have an account? Log in'}
      </button>
    </main>
  );
}
