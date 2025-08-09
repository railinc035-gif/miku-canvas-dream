import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import {
  FilePlus,
  FolderOpen,
  Save,
  Download,
  Brush,
  Box,
  Film,
  Eraser,
} from "lucide-react";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { BrushSelector } from "./BrushSelector";
import { createBrush } from "@/lib/brushes";
import { LeftToolbar } from "./LeftToolbar";
import { RightToolbar } from "./RightToolbar";

type Point = { x: number; y: number };

const COLORS = [
  "#000000",
  "#ffffff",
  "#6366f1", // brand indigo
  "#f97316", // accent orange
  "#0ea5e9",
  "#10b981",
  "#ef4444",
  "#f59e0b",
  "#a78bfa",
  "#22d3ee",
  "#1f2937",
  "#f43f5e",
];

const CanvasStudio: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState(COLORS[2]);
  const [brushWidth, setBrushWidth] = useState(8);
  const [brushType, setBrushType] = useState("pen");
  const [pointer, setPointer] = useState<Point>({ x: 0, y: 0 });

  const brush = useMemo(() => {
    return createBrush(brushType, color, brushWidth);
  }, [brushType, color, brushWidth]);

  const ctx = useRef<CanvasRenderingContext2D | null>(null);
  const lastPoint = useRef<Point | null>(null);

  const setupCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const rect = container.getBoundingClientRect();

    // Avoid zero sizes before layout settles
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const context = canvas.getContext("2d");
    if (!context) return;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.imageSmoothingEnabled = true;
    ctx.current = context;
  };

  useEffect(() => {
    setupCanvas();
    const onResize = () => setupCanvas();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!ctx.current) return;
    setIsDrawing(true);
    const p = getPos(e);
    brush.onPointerDown(ctx.current, p, lastPoint);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setPointer({ x: e.clientX, y: e.clientY });
    if (!isDrawing || !ctx.current) return;
    const p = getPos(e);
    brush.onPointerMove(ctx.current, p, lastPoint);
  };

  const endDrawing = () => {
    setIsDrawing(false);
    brush.onPointerUp(lastPoint);
  };

  const clearCanvas = () => {
    const c = canvasRef.current;
    if (!c || !ctx.current) return;
    const context = ctx.current;
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, c.width, c.height);
    toast.success("Lienzo nuevo");
  };

  const saveLocal = () => {
    const c = canvasRef.current;
    if (!c) return;
    try {
      const dataUrl = c.toDataURL("image/png");
      localStorage.setItem("miku-canvas-v1", dataUrl);
      toast.success("Proyecto guardado");
    } catch (e) {
      toast.error("No se pudo guardar");
    }
  };

  const openLocal = () => {
    const dataUrl = localStorage.getItem("miku-canvas-v1");
    if (!dataUrl) {
      toast.info("No hay proyecto guardado");
      return;
    }
    const img = new Image();
    img.onload = () => {
      const c = canvasRef.current;
      if (!c || !ctx.current) return;
      ctx.current.clearRect(0, 0, c.width, c.height);
      ctx.current.drawImage(img, 0, 0, c.width, c.height);
      toast.success("Proyecto abierto");
    };
    img.src = dataUrl;
  };

  const exportPNG = () => {
    const c = canvasRef.current;
    if (!c) return;
    const link = document.createElement("a");
    link.download = `miku-canvas-${Date.now()}.png`;
    link.href = c.toDataURL("image/png");
    link.click();
    toast.success("PNG exportado");
  };

  const glowStyle = useMemo(() => ({
    left: pointer.x - 300,
    top: pointer.y - 300,
    background: `radial-gradient(300px 300px at 50% 50%, hsl(var(--brand) / 0.25), transparent 70%)`,
  }), [pointer]);

  return (
    <div className="relative min-h-screen bg-[radial-gradient(80%_60%_at_50%_-20%,hsl(var(--muted)/0.5),transparent)]">
      {/* Top toolbar */}
      <header className="sticky top-0 z-20 w-full backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b border-border">
        <div className="container flex h-14 items-center gap-2">
          <div className="font-semibold tracking-tight text-lg app-title">Paint wisión studio</div>
          <div className="flex items-center gap-2">
            <Button variant="toolbar" size="sm" onClick={clearCanvas}><FilePlus className="mr-1" />Nuevo</Button>
            <Button variant="toolbar" size="sm" onClick={openLocal}><FolderOpen className="mr-1" />Abrir</Button>
            <Button variant="toolbar" size="sm" onClick={saveLocal}><Save className="mr-1" />Guardar</Button>
            <Button variant="toolbar" size="sm" onClick={exportPNG}><Download className="mr-1" />Exportar</Button>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="toolbar" size="sm"><Brush className="mr-1" />2D</Button>
            <Button variant="toolbar" size="sm"><Box className="mr-1" />3D</Button>
            <Button variant="toolbar" size="sm"><Film className="mr-1" />Animación</Button>
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Pointer glow signature */}
      <div className="pointer-events-none absolute z-0 h-[600px] w-[600px] rounded-full blur-3xl opacity-40 transition-transform duration-200" style={glowStyle} />

      {/* Canvas area */}
      <main className="relative z-10">
        <div className="container">
          <div className="relative mt-6 grid grid-cols-1 lg:grid-cols-[auto_1fr_320px] gap-6">
            <LeftToolbar brushType={brushType} setBrushType={setBrushType} />

            <div className="relative rounded-lg border border-border bg-card overflow-hidden col-span-1">
              <div
                ref={containerRef}
                className="relative h-[60vh] md:h-[70vh] bg-muted"
              >
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 cursor-crosshair shadow"
                  onPointerDown={startDrawing}
                  onPointerMove={draw}
                  onPointerUp={endDrawing}
                  onPointerLeave={endDrawing}
                />
              </div>
            </div>

            <RightToolbar
              brushWidth={brushWidth}
              setBrushWidth={setBrushWidth}
              color={color}
              setColor={setColor}
              COLORS={COLORS}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CanvasStudio;
