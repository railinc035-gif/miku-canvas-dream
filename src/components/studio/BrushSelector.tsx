import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Brush } from "lucide-react";

interface BrushSelectorProps {
  brushType: string;
  setBrushType: (type: string) => void;
}

const brushes = [
  { id: "pen", name: "Pluma", preview: "/previews/pen.png" },
  { id: "pencil", name: "Lápiz", preview: "/previews/pencil.png" },
  { id: "airbrush", name: "Aerógrafo", preview: "/previews/airbrush.png" },
  { id: "spray", name: "Spray", preview: "/previews/spray.png" },
  { id: "marker", name: "Rotulador", preview: "/previews/marker.png" },
  { id: "calligraphy", name: "Caligrafía", preview: "/previews/calligraphy.png" },
  { id: "dashed", name: "Guiones", preview: "/previews/dashed.png" },
  { id: "eraser", name: "Borrador", preview: "/previews/eraser.png" },
];

export function BrushSelector({ brushType, setBrushType }: BrushSelectorProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="capitalize" data-testid="brush-selector-trigger">
          <Brush className="mr-2 h-4 w-4" />
          {brushType}
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Pinceles</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {brushes.map((brush) => (
            <Button
              key={brush.id}
              variant={brushType === brush.id ? "default" : "ghost"}
              onClick={() => {
                setBrushType(brush.id);
              }}
              className="w-full flex justify-start items-center gap-4"
            >
              <span className="w-1/3 text-left">{brush.name}</span>
              <img src={brush.preview} alt={brush.name} className="w-2/3 h-5 bg-white border border-border" />
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
