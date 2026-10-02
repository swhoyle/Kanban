export const TicketCard = ({ ticket, status, meta, selected, onOpen, onEdit, onDelete, onDrop }) => (
  <div
    className={`card ${status}${onOpen ? ' clickable' : ''}${selected ? ' selected' : ''}`}
    draggable
    onClick={() => onOpen?.(ticket)}
    onDragStart={(e) => e.dataTransfer.setData('text/plain', ticket.id)}
    onDrop={onDrop}
  >
    <div className="card-top">
      <strong className="card-title">{ticket.title}</strong>
      <button
        className="btn icon-btn edit-icon"
        title="Edit"
        onClick={(e) => {
          e.stopPropagation();
          onEdit(ticket);
        }}
      >
        ✎
      </button>
      <button
        className="btn icon-btn edit-icon"
        title="Delete"
        onClick={(e) => {
          e.stopPropagation();
          if (confirm(`Delete "${ticket.title}"?`)) onDelete(ticket);
        }}
      >
        ✕
      </button>
    </div>
    {ticket.description && <p>{ticket.description}</p>}
    {meta && <div className="card-meta">{meta}</div>}
  </div>
);
