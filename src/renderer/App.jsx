import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { DEFAULT_STATUS, PROJECT_SECTIONS } from './config.js';
import { KanbanBoard } from './components/KanbanBoard.jsx';
import { Modal } from './components/Modal.jsx';
import { TicketForm } from './components/TicketForm.jsx';

const blank = (type, parent = null) => ({
  type,
  title: '',
  description: '',
  status: DEFAULT_STATUS,
  parent,
});

const nextOrder = (list, status) =>
  Math.max(-1, ...list.filter((t) => t.status === status).map((t) => t.order ?? 0)) + 1;

const App = () => {
  const [tickets, setTickets] = useState([]);
  const [editing, setEditing] = useState(null);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    window.ticketService.list().then(setTickets);
  }, []);

  // New tickets and tickets whose status changed go to the end of their column.
  const save = async (t) => {
    const prev = tickets.find((x) => x.id === t.id);
    const siblings = tickets.filter((x) => x.type === t.type && x.parent === t.parent);
    const ticket =
      !prev || prev.status !== t.status ? { ...t, order: nextOrder(siblings, t.status) } : t;
    const saved = await window.ticketService.save(ticket);
    setTickets((cur) =>
      cur.some((x) => x.id === saved.id)
        ? cur.map((x) => (x.id === saved.id ? saved : x))
        : [...cur, saved],
    );
    setEditing(null);
  };

  const reorder = async (updates) => {
    const saved = await window.ticketService.saveMany(updates);
    setTickets((cur) => cur.map((x) => saved.find((s) => s.id === x.id) ?? x));
  };

  const quickAdd = (title, type, parent = null) => save({ ...blank(type, parent), title });

  const remove = async (t) => {
    await window.ticketService.remove(t.id);
    setTickets(tickets.filter((x) => x.id !== t.id && x.parent !== t.id));
    if (t.id === openId) setOpenId(null);
    setEditing(null);
  };

  const projects = tickets.filter((t) => t.type === 'Project');
  const project = projects.find((p) => p.id === openId);
  const tasks = tickets.filter((t) => t.type === 'Task' && t.parent === openId);

  const progressOf = (p) => {
    const own = tickets.filter((t) => t.type === 'Task' && t.parent === p.id);
    const done = own.filter((t) => t.status === 'done').length;
    return own.length ? `${done}/${own.length} tasks completed` : 'No tasks';
  };

  return (
    <div className="layout">
      <main className="main">
        {project ? (
          <>
            <header className="header">
              <div className="header-left">
                <button className="btn back-btn" onClick={() => setOpenId(null)}>&lt; Back</button>
                <div className="title-row">
                  <h1>{project.title}</h1>
                </div>
              </div>
            </header>
            <p className={`description${project.description ? '' : ' empty'}`}>
              {project.description || 'No description'}
            </p>
            <h2 className="section-title">Tasks</h2>
            <KanbanBoard
              tickets={tasks}
              selectedId={editing?.id}
              onReorder={reorder}
              onEdit={setEditing}
              onDelete={remove}
              onQuickAdd={(title) => quickAdd(title, 'Task', project.id)}
              addLabel="Task"
            />
          </>
        ) : (
          <>
            <header className="header">
              <h1>Projects</h1>
            </header>
            <KanbanBoard
              tickets={projects}
              columns={PROJECT_SECTIONS}
              getMeta={progressOf}
              selectedId={editing?.id}
              onReorder={reorder}
              onOpen={(p) => setOpenId(p.id)}
              onEdit={setEditing}
              onDelete={remove}
              onQuickAdd={(title) => quickAdd(title, 'Project')}
              addLabel="Project"
            />
          </>
        )}
      </main>

      {editing && (
        <Modal onClose={() => setEditing(null)}>
          <TicketForm
            key={editing.id ?? 'new'}
            ticket={editing}
            onSave={save}
            onDelete={remove}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}
    </div>
  );
};

createRoot(document.getElementById('root')).render(<App />);
