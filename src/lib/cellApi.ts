import { jupyterAxios } from "@/lib/axios";

export interface UpdateCellPayload {
  cellId: string;
  code: string;
}

export async function updateCellAPI(payload: UpdateCellPayload) {
  const res = await jupyterAxios.post("/contents", payload);

  return res.data;
}
