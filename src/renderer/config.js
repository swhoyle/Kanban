export const STATUSES = [
  { id: 'backlog', label: '🗂️ Backlog' },
  { id: 'todo', label: '📌 To Do' },
  { id: 'in_progress', label: '🔄 In Progress' },
  { id: 'done', label: '✅ Done' },
];

export const DEFAULT_STATUS = STATUSES[0].id;

// Project stages. Ids match the task statuses so existing projects keep their section.
export const PROJECT_SECTIONS = [
  { id: 'backlog', label: '🗂️ Backlog' },
  { id: 'in_progress', label: '🛠️ In Development' },
  { id: 'done', label: '💎 Live' },
];
