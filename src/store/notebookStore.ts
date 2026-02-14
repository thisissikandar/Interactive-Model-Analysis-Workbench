import { create } from "zustand";
import { v4 as uuid } from "uuid";
import { Cell, Notebook } from "../types";

interface NotebookStore {
  notebooks: Record<string, Notebook>;
  cells: Record<string, Cell>;
  activeNotebookId: string | null;
  kernelId: string | null;

  createNotebook: () => void;
  addCell: (notebookId: string) => void;
  updateCellCode: (cellId: string, code: string) => void;
  appendOutput: (cellId: string, output: string) => void;
  setCellStatus: (cellId: string, status: Cell["status"]) => void;
  reorderCells: (notebookId: string, from: number, to: number) => void;
  setKernelId: (id: string) => void;
  deleteCell: (notebookId: string, cellId: string) => void;
}

export const useNotebookStore = create<NotebookStore>((set, get) => ({
  notebooks: {},
  cells: {},
  activeNotebookId: null,
  kernelId: null,

  createNotebook: () => {
    const id = uuid();
    set((state) => ({
      notebooks: {
        ...state.notebooks,
        [id]: { id, title: "Untitled", cellIds: [] },
      },
      activeNotebookId: id,
    }));
  },

  addCell: (notebookId) => {
    const cellId = uuid();
    set((state) => ({
      cells: {
        ...state.cells,
        [cellId]: { id: cellId, code: "", outputs: [], status: "idle" },
      },
      notebooks: {
        ...state.notebooks,
        [notebookId]: {
          ...state.notebooks[notebookId],
          cellIds: [...state.notebooks[notebookId].cellIds, cellId],
        },
      },
    }));
  },

  updateCellCode: (cellId, code) =>
    set((state) => ({
      cells: {
        ...state.cells,
        [cellId]: { ...state.cells[cellId], code },
      },
    })),

  appendOutput: (cellId, output) =>
    set((state) => ({
      cells: {
        ...state.cells,
        [cellId]: {
          ...state.cells[cellId],
          outputs: [...state.cells[cellId].outputs, output],
        },
      },
    })),

  setCellStatus: (cellId, status) =>
    set((state) => ({
      cells: {
        ...state.cells,
        [cellId]: { ...state.cells[cellId], status },
      },
    })),

  reorderCells: (notebookId, from, to) => {
    const arr = [...get().notebooks[notebookId].cellIds];
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);

    set((state) => ({
      notebooks: {
        ...state.notebooks,
        [notebookId]: {
          ...state.notebooks[notebookId],
          cellIds: arr,
        },
      },
    }));
  },
  deleteCell: (notebookId, cellId) =>
    set((state) => {
      const newCells = { ...state.cells };
      delete newCells[cellId];

      return {
        cells: newCells,

        notebooks: {
          ...state.notebooks,

          [notebookId]: {
            ...state.notebooks[notebookId],

            cellIds: state.notebooks[notebookId].cellIds.filter(
              (id) => id !== cellId,
            ),
          },
        },
      };
    }),

  setKernelId: (id) => set({ kernelId: id }),
}));
