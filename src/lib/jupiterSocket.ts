// const token = "bdbf430e3e034979b4d4de1d3ac8d913";
// const kernelId = "ba75804e-31d7-4f7f-a3b2-631d284c07a7";

// const socket = new WebSocket(
//   `ws://localhost:8000/user/admin/api/kernels/${kernelId}/channels?token=${token}`,
// );

// socket.onopen = () => console.log("connected");

// socket.onmessage = (e) => {
//   const data = JSON.parse(e.data);
//   console.log(data);
// };
export function createKernelSocket(kernelId: string) {
  const token = process.env.NEXT_PUBLIC_JUPYTER_TOKEN!;
  console.log("Creating kernel socket with token:", token);
  const url = `ws://localhost:8000/user/admin/api/kernels/${kernelId}/channels?token=${token}`;

  const socket = new WebSocket(url);

  socket.onopen = () => console.log("WebSocket connected");

  socket.onerror = (err) => console.error("WebSocket failed:", err);

  socket.onclose = () => console.log("WebSocket closed");

  return socket;
}
