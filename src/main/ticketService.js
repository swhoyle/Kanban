import { app } from 'electron';
import fs from 'node:fs';
import path from 'node:path';

// A function, not a const: app.getPath()
// isn't usable until Electron is ready.
const file = () => path.join(app.getPath('userData'), 'tickets.json');

// Returns every ticket, including soft-deleted ones.
// A missing or corrupt file reads as empty.
const read = () => {
  try {
    const tickets = JSON.parse(fs.readFileSync(file(), 'utf8'));
    console.log(`[ticketService] read ${tickets.length} tickets from ${file()}`);
    return tickets;
  } catch {
    console.log(`[ticketService] no readable file at ${file()}, starting empty`);
    return [];
  }
};

// Overwrites the whole file with the given tickets.
const write = (tickets) => {
  fs.writeFileSync(file(), JSON.stringify(tickets, null, 2));
  console.log(`[ticketService] wrote ${tickets.length} tickets to ${file()}`);
};

// Active tickets only; soft-deleted ones
// stay in the file but are hidden.
export const list = () => read().filter((t) => !t.deletedAt);

// Creates the ticket if it has no id,
// otherwise replaces the existing one.
// Returns the saved ticket.
export const save = (ticket) => {
  const tickets = read();
  const saved = ticket.id ? ticket : { ...ticket, id: crypto.randomUUID() };
  console.log(`[ticketService] ${ticket.id ? 'update' : 'create'} ${saved.type} ${saved.id}`);
  write(
    ticket.id ? tickets.map((t) => (t.id === ticket.id ? saved : t)) : [...tickets, saved],
  );
  return saved;
};

// Replaces several existing tickets by id in a single write (used for reordering).
export const saveMany = (updates) => {
  console.log(`[ticketService] update ${updates.length} tickets`);
  const byId = new Map(updates.map((t) => [t.id, t]));
  write(read().map((t) => byId.get(t.id) ?? t));
  return updates;
};

// Soft delete: marks the ticket (and a project's tasks)
// with deletedAt instead of removing them.
export const remove = (id) => {
  console.log(`[ticketService] delete ${id}`);
  const deletedAt = new Date().toISOString();
  write(
    read().map((t) =>
      !t.deletedAt && (t.id === id || t.parent === id) ? { ...t, deletedAt } : t,
    ),
  );
};
