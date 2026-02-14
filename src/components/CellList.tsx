"use client";

import { useRef } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useVirtualizer } from "@tanstack/react-virtual";

import { useNotebookStore } from "../store/notebookStore";
import CellItem from "./CellItem";

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  notebookId: string;
  socket: WebSocket | null;
  executionMap: React.MutableRefObject<Map<string, string>>;
}

export default function CellList({ notebookId, socket, executionMap }: Props) {
  const parentRef = useRef<HTMLDivElement>(null);

  const cellIds = useNotebookStore(
    (s) => s.notebooks[notebookId]?.cellIds || [],
  );

  const reorderCells = useNotebookStore((s) => s.reorderCells);

  const rowVirtualizer = useVirtualizer({
    count: cellIds.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 180,
    overscan: 5,
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = cellIds.indexOf(active.id as string);
    const newIndex = cellIds.indexOf(over.id as string);

    reorderCells(notebookId, oldIndex, newIndex);
  }

  if (cellIds.length === 0) {
    return (
      <Card className="mt-4 p-6 text-center text-muted-foreground">
        No cells yet. Click &ldquo;Add Cell&ldquo; to begin.
      </Card>
    );
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={cellIds} strategy={verticalListSortingStrategy}>
        <ScrollArea
          ref={parentRef}
          className="h-[600px] mt-4 border rounded-md"
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const cellId = cellIds[virtualRow.index];

              return (
                <SortableRow
                  key={cellId}
                  id={cellId}
                  top={virtualRow.start}
                  socket={socket}
                  executionMap={executionMap}
                />
              );
            })}
          </div>
        </ScrollArea>
      </SortableContext>
    </DndContext>
  );
}

interface RowProps {
  id: string;
  top: number;
  socket: WebSocket | null;
  executionMap: React.MutableRefObject<Map<string, string>>;
}

function SortableRow({ id, top, socket, executionMap }: RowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: "100%",

    transform: CSS.Transform.toString(transform) + ` translateY(${top}px)`,

    transition,

    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="px-4 py-2">
      <CellItem
        cellId={id}
        socket={socket}
        executionMap={executionMap}
        dragHandleProps={{
          ...attributes,
          ...listeners,
        }}
      />
    </div>
  );
}
