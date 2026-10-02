import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('ticketService', {
  list: () => ipcRenderer.invoke('tickets:list'),
  save: (ticket) => ipcRenderer.invoke('tickets:save', ticket),
  saveMany: (tickets) => ipcRenderer.invoke('tickets:saveMany', tickets),
  remove: (id) => ipcRenderer.invoke('tickets:remove', id),
});
