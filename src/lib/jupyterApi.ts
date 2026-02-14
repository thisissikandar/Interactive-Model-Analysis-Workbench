import { jupyterAxios } from "@/lib/axios";

export async function createNotebookFile(name: string) {
  const res = await jupyterAxios.put(`/contents/${name}.ipynb`, {
    type: "notebook",
  });

  return res.data;
}

export async function createKernel() {
  const res = await jupyterAxios.post("/kernels");

  return res.data;
}
