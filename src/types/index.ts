export type CellStatus = "idle" | "running" | "error";

export interface Cell {
  id: string;
  code: string;
  outputs: string[];
  status: CellStatus;
}

export interface Notebook {
  id: string;
  title: string;
  cellIds: string[];
}
