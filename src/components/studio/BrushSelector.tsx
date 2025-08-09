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
  { id: "pen", name: "Pluma" },
  { id: "pencil", name: "Lápiz" },
  { id: "airbrush", name: "Aerógrafo" },
  { id: "marker", name: "Rotulador" },
  { id: "calligraphy", name: "Caligrafía" },
  { id: "eraser", name: "Borrador" },
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
                // We can close the sheet after selection, but let's keep it open for now
              }}
            >
              {brush.name}
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
