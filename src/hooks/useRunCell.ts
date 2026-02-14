"use client";

import { v4 as uuid } from "uuid";
import { useMutation } from "@tanstack/react-query";

import { useNotebookStore } from "../store/notebookStore";
import { updateCellAPI } from "@/lib/cellApi";

export function useRunCell(
  socket: WebSocket | null,
  executionMap: React.MutableRefObject<Map<string, string>>,
) {
  const cells = useNotebookStore((s) => s.cells);
  const setCellStatus = useNotebookStore((s) => s.setCellStatus);

  // React Query mutation using axios
  const mutation = useMutation({
    mutationFn: updateCellAPI,
  });

  const runCell = (cellId: string) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error("Socket not connected");
      return;
    }

    const code = cells[cellId]?.code;

    if (!code) return;

    const msgId = uuid();

    // map msgId -> cellId
    executionMap.current.set(msgId, cellId);

    // update UI state
    setCellStatus(cellId, "running");

    // required POST request using React Query + axios
    mutation.mutate({
      cellId,
      code,
    });

    // send execution request to Jupyter kernel
    socket.send(
      JSON.stringify({
        header: {
          msg_id: msgId,
          username: "admin",
          session: uuid(),
          msg_type: "execute_request",
          version: "5.3",
        },
        parent_header: {},
        metadata: {},
        content: {
          code,
          silent: false,
          store_history: true,
          allow_stdin: false,
          stop_on_error: true,
        },
      }),
    );
  };

  return {
    runCell,
    isRunning: mutation.isPending,
    error: mutation.error,
  };
}
