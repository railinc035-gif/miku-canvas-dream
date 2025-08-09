import { BrushSelector } from "./BrushSelector";

interface LeftToolbarProps {
  brushType: string;
  setBrushType: (type: string) => void;
}

export function LeftToolbar({ brushType, setBrushType }: LeftToolbarProps) {
  return (
    <aside className="rounded-lg border border-border bg-card p-4 flex flex-col items-center gap-4">
      <BrushSelector brushType={brushType} setBrushType={setBrushType} />
      {/* Other tools will be added here */}
    </aside>
  );
}
