import { useState } from 'react';
import { PROJECT_SECTIONS, STATUSES } from '../config.js';

export const TicketForm = ({ ticket, onSave, onDelete, onCancel }) => {
  const [t, setT] = useState(ticket);
  const set = (k) => (e) => setT({ ...t, [k]: e.target.value });

  return (
    <form
      className="form"
      onSubmit={(e) => {
        e.preventDefault();
        onSave(t);
      }}
    >
      <h3>{t.id ? 'Edit' : 'New'} {t.type}</h3>
      <input className="field" required data-autofocus placeholder="Title" value={t.title} onChange={set('title')} />
      <textarea
        className="field"
        rows={3}
        placeholder="Description"
        value={t.description}
        onKeyDown={(e) => {
          if (e.key !== 'Enter') return;
          e.preventDefault();
          e.currentTarget.form.requestSubmit();
        }}
        onChange={(e) => setT({ ...t, description: e.target.value.replace(/[\r\n]+/g, ' ') })}
      />
      <select className="field" value={t.status} onChange={set('status')}>
        {(t.type === 'Task' ? STATUSES : PROJECT_SECTIONS).map((s) => (
          <option key={s.id} value={s.id}>{s.label}</option>
        ))}
      </select>
      <div className="form-buttons">
        <button className="btn" type="submit">Save</button>
        <button className="btn" type="button" onClick={onCancel}>Cancel</button>
        {t.id && (
          <button
            className="btn danger right"
            type="button"
            onClick={() => confirm(`Delete "${t.title}"?`) && onDelete(t)}
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
};
