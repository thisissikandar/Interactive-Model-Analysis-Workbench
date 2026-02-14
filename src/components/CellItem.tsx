"use client";

import { memo } from "react";
import { useNotebookStore } from "../store/notebookStore";
import { useRunCell } from "../hooks/useRunCell";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface Props {
  cellId: string;
  socket: WebSocket | null;
  executionMap: React.MutableRefObject<Map<string, string>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dragHandleProps?: any;
}

function CellItem({ cellId, socket, executionMap, dragHandleProps }: Props) {
  const cell = useNotebookStore((s) => s.cells[cellId]);
  const updateCellCode = useNotebookStore((s) => s.updateCellCode);
  const deleteCell = useNotebookStore((s) => s.deleteCell);
  const activeNotebookId = useNotebookStore((s) => s.activeNotebookId);
  const { runCell } = useRunCell(socket, executionMap);

  if (!cell) return null;

  return (
    <Card className="mb-4 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div
            {...dragHandleProps}
            className="cursor-grab px-2 text-muted-foreground"
          >
            ☰
          </div>

          <span className="text-sm font-medium">Code Cell</span>

          <Badge
            variant={
              cell.status === "running"
                ? "secondary"
                : cell.status === "error"
                  ? "destructive"
                  : "outline"
            }
          >
            {cell.status}
          </Badge>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            className="cursor-pointer"
            onClick={() => {
              console.log("Running cell", cellId);
              runCell(cellId);
            }}
            disabled={cell.status === "running"}
          >
            {cell.status === "running" ? "Running..." : "Run"}
          </Button>

          <Button
            variant="destructive"
            className="cursor-pointer"
            size="sm"
            onClick={() => {
              console.log("deleting.......");
              if (!activeNotebookId) {
                console.error("No active notebook");
                return;
              }
              deleteCell(activeNotebookId, cellId);
            }}
          >
            Delete
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <Textarea
          value={cell.code}
          onChange={(e) => updateCellCode(cellId, e.target.value)}
          placeholder="Write Python code..."
          className="font-mono min-h-[140px]"
        />

        {cell.outputs.length > 0 && (
          <div className="bg-muted rounded-md p-3 text-sm font-mono whitespace-pre-wrap max-h-60 overflow-auto border">
            {cell.outputs.map((out, i) => (
              <div key={i}>{out}</div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default memo(CellItem);
