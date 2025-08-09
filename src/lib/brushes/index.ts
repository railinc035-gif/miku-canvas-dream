type Point = { x: number; y: number };

export interface Brush {
  onPointerDown(ctx: CanvasRenderingContext2D, p: Point, lastPoint: React.MutableRefObject<Point | null>): void;
  onPointerMove(ctx: CanvasRenderingContext2D, p: Point, lastPoint: React.MutableRefObject<Point | null>): void;
  onPointerUp(lastPoint: React.MutableRefObject<Point | null>): void;
}

class PenBrush implements Brush {
  protected color: string;
  protected width: number;

  constructor(color: string, width: number) {
    this.color = color;
    this.width = width;
  }

  onPointerDown(ctx: CanvasRenderingContext2D, p: Point, lastPoint: React.MutableRefObject<Point | null>) {
    lastPoint.current = p;
  }

  onPointerMove(ctx: CanvasRenderingContext2D, p: Point, lastPoint: React.MutableRefObject<Point | null>) {
    const lp = lastPoint.current ?? p;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(lp.x, lp.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    lastPoint.current = p;
  }

  onPointerUp(lastPoint: React.MutableRefObject<Point | null>) {
    lastPoint.current = null;
  }
}

class PencilBrush implements Brush {
    private color: string;
    private width: number;

    constructor(color: string, width: number) {
        this.color = color;
        this.width = width;
    }

    onPointerDown(ctx: CanvasRenderingContext2D, p: Point, lastPoint: React.MutableRefObject<Point | null>) {
        lastPoint.current = p;
    }

    onPointerMove(ctx: CanvasRenderingContext2D, p: Point, lastPoint: React.MutableRefObject<Point | null>) {
        const lp = lastPoint.current ?? p;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.lineCap = 'square';
        ctx.lineJoin = 'miter';
        ctx.beginPath();
        ctx.moveTo(lp.x, lp.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        lastPoint.current = p;
    }

    onPointerUp(lastPoint: React.MutableRefObject<Point | null>) {
        lastPoint.current = null;
    }
}

class AirbrushBrush implements Brush {
    private color: string;
    private width: number;

    constructor(color: string, width: number) {
        this.color = color;
        this.width = width;
    }

    onPointerDown(ctx: CanvasRenderingContext2D, p: Point, lastPoint: React.MutableRefObject<Point | null>) {
        lastPoint.current = p;
    }

    onPointerMove(ctx: CanvasRenderingContext2D, p: Point, lastPoint: React.MutableRefObject<Point | null>) {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.1;
        for (let i = 0; i < 30; i++) {
            const angle = Math.random() * 2 * Math.PI;
            const radius = Math.random() * this.width;
            const x = p.x + radius * Math.cos(angle);
            const y = p.y + radius * Math.sin(angle);
            ctx.beginPath();
            ctx.arc(x, y, Math.random() * (this.width / 10), 0, 2 * Math.PI);
            ctx.fill();
        }
        ctx.globalAlpha = 1.0;
        lastPoint.current = p;
    }

    onPointerUp(lastPoint: React.MutableRefObject<Point | null>) {
        lastPoint.current = null;
    }
}

class EraserBrush extends PenBrush {
    constructor(width: number) {
        super("#ffffff", width);
    }
}

class MarkerBrush implements Brush {
    private color: string;
    private width: number;

    constructor(color: string, width: number) {
        this.color = color;
        this.width = width;
    }

    onPointerDown(ctx: CanvasRenderingContext2D, p: Point, lastPoint: React.MutableRefObject<Point | null>) {
        lastPoint.current = p;
    }

    onPointerMove(ctx: CanvasRenderingContext2D, p: Point, lastPoint: React.MutableRefObject<Point | null>) {
        const lp = lastPoint.current ?? p;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.lineCap = 'square';
        ctx.globalAlpha = 0.7; // Marker-like transparency
        ctx.beginPath();
        ctx.moveTo(lp.x, lp.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        ctx.globalAlpha = 1.0; // Reset alpha
        lastPoint.current = p;
    }

    onPointerUp(lastPoint: React.MutableRefObject<Point | null>) {
        lastPoint.current = null;
    }
}

class CalligraphyBrush implements Brush {
    private color: string;
    private width: number;

    constructor(color: string, width: number) {
        this.color = color;
        this.width = width;
    }

    onPointerDown(ctx: CanvasRenderingContext2D, p: Point, lastPoint: React.MutableRefObject<Point | null>) {
        lastPoint.current = p;
    }

    onPointerMove(ctx: CanvasRenderingContext2D, p: Point, lastPoint: React.MutableRefObject<Point | null>) {
        const lp = lastPoint.current ?? p;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width / 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        for (let i = -2; i <= 2; i++) {
            ctx.beginPath();
            ctx.moveTo(lp.x + i, lp.y);
            ctx.lineTo(p.x + i, p.y);
            ctx.stroke();
        }
        lastPoint.current = p;
    }

    onPointerUp(lastPoint: React.MutableRefObject<Point | null>) {
        lastPoint.current = null;
    }
}

class DashedBrush extends PenBrush {
    onPointerMove(ctx: CanvasRenderingContext2D, p: Point, lastPoint: React.MutableRefObject<Point | null>) {
        ctx.setLineDash([this.width, this.width]);
        super.onPointerMove(ctx, p, lastPoint);
        ctx.setLineDash([]); // Reset line dash
    }
}

class SprayBrush implements Brush {
    private color: string;
    private width: number;

    constructor(color: string, width: number) {
        this.color = color;
        this.width = width;
    }

    onPointerDown(ctx: CanvasRenderingContext2D, p: Point, lastPoint: React.MutableRefObject<Point | null>) {
        lastPoint.current = p;
    }

    onPointerMove(ctx: CanvasRenderingContext2D, p: Point, lastPoint: React.MutableRefObject<Point | null>) {
        ctx.fillStyle = this.color;
        const sprayRadius = this.width * 2;
        for (let i = 0; i < 40; i++) {
            const angle = Math.random() * 2 * Math.PI;
            const radius = Math.random() * sprayRadius;
            const x = p.x + radius * Math.cos(angle);
            const y = p.y + radius * Math.sin(angle);
            ctx.globalAlpha = Math.random() * 0.2;
            ctx.beginPath();
            ctx.arc(x, y, Math.random() * 2, 0, 2 * Math.PI);
            ctx.fill();
        }
        ctx.globalAlpha = 1.0;
        lastPoint.current = p;
    }

    onPointerUp(lastPoint: React.MutableRefObject<Point | null>) {
        lastPoint.current = null;
    }
}

export function createBrush(type: string, color: string, width: number): Brush {
  switch (type) {
    case 'pen':
      return new PenBrush(color, width);
    case 'pencil':
      return new PencilBrush(color, width);
    case 'airbrush':
      return new AirbrushBrush(color, width);
    case 'spray':
        return new SprayBrush(color, width);
    case 'marker':
        return new MarkerBrush(color, width);
    case 'calligraphy':
        return new CalligraphyBrush(color, width);
    case 'dashed':
        return new DashedBrush(color, width);
    case 'eraser':
      return new EraserBrush(width);
    default:
      return new PenBrush(color, width);
  }
}
