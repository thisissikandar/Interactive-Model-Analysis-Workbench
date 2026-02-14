"use client";

import { useEffect, useRef, useState } from "react";

import { useNotebookStore } from "../store/notebookStore";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { createKernel } from "@/lib/jupyterApi";
import { createKernelSocket } from "@/lib/jupiterSocket";

import CellList from "@/components/CellList";

export default function NotebookPage() {
  const {
    createNotebook,
    activeNotebookId,
    addCell,
    setKernelId,
    appendOutput,
    setCellStatus,
  } = useNotebookStore();

  const socketRef = useRef<WebSocket | null>(null);

  // CRITICAL: single execution map shared across app
  const executionMap = useRef<Map<string, string>>(new Map());

  const [connected, setConnected] = useState(false);

  // Create notebook once
  useEffect(() => {
    createNotebook();
  }, [createNotebook]);

  // Initialize kernel and websocket
  useEffect(() => {
    async function initKernel() {
      try {
        const kernel = await createKernel();
        setKernelId(kernel.id);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        const socket = createKernelSocket(kernel.id);

        socketRef.current = socket;

        socket.onopen = () => {
          console.log("Kernel connected");
          setConnected(true);
        };

        socket.onmessage = (event) => {
          const msg = JSON.parse(event.data);

          const parentId = msg.parent_header?.msg_id;

          if (!parentId) return;

          const cellId = executionMap.current.get(parentId);

          if (!cellId) return;

          switch (msg.msg_type) {
            case "stream":
              appendOutput(cellId, msg.content.text);
              break;

            case "execute_result":
              appendOutput(cellId, msg.content.data?.["text/plain"] ?? "");
              break;

            case "error":
              appendOutput(
                cellId,
                msg.content.traceback?.join("\n") ?? "Error",
              );

              setCellStatus(cellId, "error");
              break;

            case "status":
              if (msg.content.execution_state === "idle") {
                setCellStatus(cellId, "idle");
              }

              break;
          }
        };

        socket.onerror = (err) => {
          console.error("WebSocket error", err);
        };

        socket.onclose = () => {
          console.log("Kernel disconnected");

          setConnected(false);
        };
      } catch (error) {
        console.error("Kernel initialization failed", error);
      }
    }

    initKernel();

    return () => {
      socketRef.current?.close();
    };
  }, [setKernelId, appendOutput, setCellStatus]);

  if (!activeNotebookId) {
    return <div className="p-6">Initializing...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card className="p-4 flex justify-between items-center mb-4">
        <div className="text-lg font-semibold">Interactive Workbench</div>

        <div className="flex gap-2 items-center">
          <div
            className={`text-xs px-2 py-1 rounded ${
              connected
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {connected ? "Connected" : "Disconnected"}
          </div>

          <Button onClick={() => addCell(activeNotebookId)}>Add Cell</Button>
        </div>
      </Card>

      <CellList
        notebookId={activeNotebookId}
        socket={socketRef.current}
        executionMap={executionMap}
      />
    </div>
  );
}
