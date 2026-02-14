# Interactive Model Analysis Workbench

A high-fidelity prototype of an interactive notebook-style workbench built using Next.js, Zustand, React Query, and JupyterHub. This application allows users to create notebooks, manage code cells, execute Python code, and view real-time outputs via WebSocket.

This project was built as part of the Senior React Engineer assignment for AryaXAI.

---

# Features

## Notebook Management
- Create notebooks
- Add new cells
- Delete cells
- Reorder cells using drag and drop

## Code Execution
- Execute Python code in real time
- Connects to JupyterHub backend
- Streams output using WebSocket
- Output appears in correct cell

## State Management
- Zustand for efficient client state
- Normalized state structure
- Scalable architecture

## Performance Optimization
- Virtualized rendering using @tanstack/react-virtual
- Supports hundreds of cells efficiently

## Modern UI
- Built with shadcn UI
- Tailwind CSS styling
- Drag and drop using dnd-kit

---

# Tech Stack

Frontend:
- Next.js
- TypeScript
- Zustand
- React Query
- Axios
- shadcn UI
- Tailwind CSS
- dnd-kit
- @tanstack/react-virtual

Backend:
- JupyterHub (Docker)

---

# Project Structure

