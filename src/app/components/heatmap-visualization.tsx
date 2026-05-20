import { useEffect, useRef } from 'react';

interface HeatmapVisualizationProps {
  imageUrl: string;
  heatmapData: number[][];
}

export function HeatmapVisualization({ imageUrl, heatmapData }: HeatmapVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || heatmapData.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Set canvas size
      canvas.width = 600;
      canvas.height = 600;

      // Draw original image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Draw heatmap overlay
      const cellWidth = canvas.width / heatmapData[0].length;
      const cellHeight = canvas.height / heatmapData.length;

      heatmapData.forEach((row, i) => {
        row.forEach((value, j) => {
          if (value > 0.3) {
            // Only show significant activations
            const alpha = value * 0.6;
            const hue = (1 - value) * 240; // Blue (240) to Red (0)
            ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${alpha})`;
            ctx.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
          }
        });
      });
    };
    img.src = imageUrl;
  }, [imageUrl, heatmapData]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="w-full h-auto rounded-lg border border-gray-200"
      />
      <div className="mt-3 flex items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ background: 'hsl(240, 100%, 50%)' }} />
          <span className="text-gray-600">Low attention</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ background: 'hsl(0, 100%, 50%)' }} />
          <span className="text-gray-600">High attention</span>
        </div>
      </div>
    </div>
  );
}
