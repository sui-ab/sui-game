import { useEffect, useRef } from "react";
import drivers from "./drivers";

export default function Game() {
  const { ws } = drivers;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
    }
  }, [canvasRef]);

  ws.addEventListener("open", () => {
    console.log("ws open");
    ws.send("hello");
  });

  return <canvas ref={canvasRef} className="w-screen h-screen bg-slate-300" />;
}
