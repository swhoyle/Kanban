import { DEFAULT_STATUS, STATUSES } from '../config.js';
import { QuickAdd } from './QuickAdd.jsx';
import { TicketCard } from './TicketCard.jsx';

export const KanbanBoard = ({
  tickets,
  columns = STATUSES,
  selectedId,
  onReorder,
  onOpen,
  onEdit,
  onDelete,
  getMeta,
  onQuickAdd,
  addLabel,
}) => {
  // Tickets with an unrecognized status (e.g. legacy data) are shown in the default column.
  const columnOf = (t) => (columns.some((c) => c.id === t.status) ? t.status : DEFAULT_STATUS);

  // Array.sort is stable, so tickets without an order keep their saved sequence.
  const sorted = (status) =>
    tickets.filter((t) => columnOf(t) === status).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // Drops the dragged ticket into a column, before/after targetId (or at the end if none).
  const dropAt = (e, status, targetId = null) => {
    e.preventDefault();
    e.stopPropagation();
    const id = e.dataTransfer.getData('text/plain');
    const moved = tickets.find((t) => t.id === id);
    if (!moved || targetId === id) return;

    const column = sorted(status).filter((t) => t.id !== id);
    let index = column.length;
    if (targetId) {
      const rect = e.currentTarget.getBoundingClientRect();
      const after = e.clientY > rect.top + rect.height / 2;
      index = column.findIndex((t) => t.id === targetId) + (after ? 1 : 0);
    }
    column.splice(index, 0, { ...moved, status });
    onReorder(column.map((t, order) => ({ ...t, order })));
  };

  return (
    <div className="board">
      {columns.map((c) => {
        const items = sorted(c.id);
        if (c.hideWhenEmpty && items.length === 0) return null;

        return (
          <div
            key={c.id}
            className={`column ${c.id}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => dropAt(e, c.id)}
          >
            <h3>
              {c.label}
              <span className="count">{items.length}</span>
            </h3>
            {items.map((t) => (
              <TicketCard
                key={t.id}
                ticket={t}
                status={c.id}
                selected={t.id === selectedId}
                onOpen={onOpen}
                onEdit={onEdit}
                onDelete={onDelete}
                meta={getMeta?.(t)}
                onDrop={(e) => dropAt(e, c.id, t.id)}
              />
            ))}
            {c.id === DEFAULT_STATUS && onQuickAdd && (
              <QuickAdd label={addLabel} onAdd={onQuickAdd} />
            )}
          </div>
        );
      })}
    </div>
  );
};
