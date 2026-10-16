import { useEffect, useState } from 'react';
import { api } from './api.js';

const FILTERS = [['', 'All'], ['open', 'Open'], ['done', 'Done']];

export default function TaskBoard({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState('');
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [editing, setEditing] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [error, setError] = useState('');

  const handleError = (err) => {
    if (err.status === 401) return onLogout();
    setError(err.message);
  };

  useEffect(() => {
    api.listTasks(status).then(setTasks).catch(handleError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const add = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setError('');
    try {
      const task = await api.createTask({ title, dueDate });
      if (status !== 'done') setTasks([task, ...tasks]);
      setTitle(''); setDueDate('');
    } catch (err) { handleError(err); }
  };

  const toggle = async (t) => {
    try {
      const updated = await api.updateTask(t._id, { done: !t.done });
      setTasks(tasks.map((x) => (x._id === t._id ? updated : x)));
    } catch (err) { handleError(err); }
  };

  const saveEdit = async (t) => {
    try {
      const updated = await api.updateTask(t._id, { title: editTitle });
      setTasks(tasks.map((x) => (x._id === t._id ? updated : x)));
      setEditing(null);
    } catch (err) { handleError(err); }
  };

  const remove = async (t) => {
    try {
      await api.deleteTask(t._id);
      setTasks(tasks.filter((x) => x._id !== t._id));
    } catch (err) { handleError(err); }
  };

  const fmt = (d) => new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });

  return (
    <main className="board">
      <header>
        <h1>{user.name}’s tasks</h1>
        <button className="link" onClick={onLogout}>Log out</button>
      </header>

      <form className="add" onSubmit={add}>
        <input placeholder="What needs doing?" value={title} onChange={(e) => setTitle(e.target.value)} aria-label="Task title" />
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} aria-label="Due date" />
        <button className="primary">Add task</button>
      </form>
      {error && <p className="error" role="alert">{error}</p>}

      <div className="filters">
        {FILTERS.map(([value, label]) => (
          <button key={label} className={status === value ? 'on' : ''} onClick={() => setStatus(value)}>{label}</button>
        ))}
      </div>

      {tasks.length === 0 ? (
        <p className="empty">No tasks here yet. Add one above.</p>
      ) : (
        <ul>
          {tasks.map((t) => (
            <li key={t._id} className={t.done ? 'done' : ''}>
              <input type="checkbox" checked={t.done} onChange={() => toggle(t)} aria-label={`Mark "${t.title}" ${t.done ? 'open' : 'done'}`} />
              {editing === t._id ? (
                <input className="edit" autoFocus value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(t); if (e.key === 'Escape') setEditing(null); }} />
              ) : (
                <span className="title">{t.title}</span>
              )}
              {t.dueDate && <time>{fmt(t.dueDate)}</time>}
              {editing === t._id ? (
                <button className="link" onClick={() => saveEdit(t)}>Save</button>
              ) : (
                <button className="link" onClick={() => { setEditing(t._id); setEditTitle(t.title); }}>Edit</button>
              )}
              <button className="link danger" onClick={() => remove(t)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
