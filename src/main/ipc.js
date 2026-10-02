import { ipcMain } from 'electron';
import * as ticketService from './ticketService.js';

export const registerIpc = () => {
  ipcMain.handle('tickets:list', () => ticketService.list());
  ipcMain.handle('tickets:save', (_e, ticket) => ticketService.save(ticket));
  ipcMain.handle('tickets:saveMany', (_e, tickets) => ticketService.saveMany(tickets));
  ipcMain.handle('tickets:remove', (_e, id) => ticketService.remove(id));
};
