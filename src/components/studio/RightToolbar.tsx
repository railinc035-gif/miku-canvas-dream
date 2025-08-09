import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface RightToolbarProps {
  brushWidth: number;
  setBrushWidth: (width: number) => void;
  color: string;
  setColor: (color: string) => void;
  COLORS: string[];
}

export function RightToolbar({ brushWidth, setBrushWidth, color, setColor, COLORS }: RightToolbarProps) {
  return (
    <aside className="rounded-lg border border-border bg-card p-4">
      <h2 className="text-sm font-medium mb-3 text-muted-foreground">Opciones de Pincel</h2>

      <div className="mt-4">
        <div className="text-xs mb-2 text-muted-foreground">Tamaño ({brushWidth}px)</div>
        <Slider value={[brushWidth]} min={1} max={48} step={1} onValueChange={([v]) => setBrushWidth(v)} />
      </div>

      <div className="mt-6">
        <div className="text-xs mb-2 text-muted-foreground">Colores</div>
        <div className="grid grid-cols-8 gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              aria-label={`Color ${c}`}
              onClick={() => setColor(c)}
              className={`h-7 w-7 rounded border border-border transition-transform hover:scale-105 ${color === c ? "ring-2 ring-ring" : ""}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      <div className="mt-6">
        <Button variant="hero" className="w-full">Comenzar a crear</Button>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Consejo: Mantén pulsado y dibuja. Exporta tu obra como PNG cuando quieras.
      </p>
    </aside>
  );
}
