import { useState } from 'react';

// "+" button that turns into a one-line title input; Enter adds and keeps it open for the next one.
export const QuickAdd = ({ label, onAdd }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');

  const close = () => {
    setOpen(false);
    setTitle('');
  };

  if (!open) {
    return (
      <button className="btn icon-btn quick-add" title={`Add ${label}`} onClick={() => setOpen(true)}>
        + Add {label}
      </button>
    );
  }

  return (
    <input
      className="field"
      autoFocus
      placeholder={`Add ${label}...`}
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      onBlur={close}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && title.trim()) {
          onAdd(title.trim());
          setTitle('');
        } else if (e.key === 'Escape') {
          close();
        }
      }}
    />
  );
};
