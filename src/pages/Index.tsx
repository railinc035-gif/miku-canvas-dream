import { Helmet } from "react-helmet-async";
import CanvasStudio from "@/components/studio/CanvasStudio";

const Index = () => {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Paint wisión studio | Estudio de Arte y Animación 2D/3D</title>
        <meta name="description" content="Crea arte 2D y 3D con un lienzo moderno. Pinceles, colores y exportación PNG en un estudio elegante." />
        <link rel="canonical" href={`${origin}/`} />
        <meta property="og:title" content="Paint wisión studio" />
        <meta property="og:description" content="Estudio de Arte y Animación 2D/3D" />
        <meta property="og:type" content="website" />
      </Helmet>
      <h1 className="sr-only">Paint wisión studio - Estudio de Arte y Animación 2D/3D</h1>
      <CanvasStudio />
    </div>
  );
};

export default Index;
