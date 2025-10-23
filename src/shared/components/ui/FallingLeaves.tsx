import {useEffect, useRef} from "react";

function setupCanvasResize(canvas: HTMLCanvasElement) {
    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resize();
    return resize;
}

function generateLeaves(canvas: HTMLCanvasElement, color: string[]) {
    return Array.from({length: 20}, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 10 + Math.random() * 20,
        color: color[Math.floor(Math.random() * color.length)],
        speed: 0.4 + Math.random() * 0.5,
        drift: (Math.random() - 0.5) * 2,
        rotation: Math.random() * 360,
    }));
}

function createLeafDrawer(ctx: CanvasRenderingContext2D) {
    const drawLeaf = (x: number, y: number, size: number, rotation: number, color: string) => {
        ctx.save()
        ctx.translate(x, y);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(size / 2, -size / 2, 0, -size);
        ctx.quadraticCurveTo(-size / 2, -size / 2, 0, 0);
        ctx.fill();
        ctx.restore();
    }
    return drawLeaf;
}

function startLeafAnimation(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, leaves: {
    x: number;
    y: number;
    size: number;
    color: string;
    speed: number;
    drift: number;
    rotation: number
}[], drawLeaf: (x: number, y: number, size: number, rotation: number, color: string) => void) {
    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const leaf of leaves) {
            drawLeaf(leaf.x, leaf.y, leaf.size, leaf.rotation, leaf.color);
            leaf.y += leaf.speed;
            leaf.x += Math.sin(leaf.y / 50) * leaf.drift;
            leaf.rotation += leaf.drift;
            if (leaf.y > canvas.height + 50) {
                leaf.y = -10;
                leaf.x = Math.random() * canvas.width;
            }
        }
        requestAnimationFrame(animate);
    };
    animate();
}

export default function FallingLeaves(){
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return;
        }

        const resize = setupCanvasResize(canvas);
        window.addEventListener('resize', resize);

        const color = ["#d97706", "#fbbf24", "#92400e"]
        const leaves = generateLeaves(canvas, color);

        const drawLeaf = createLeafDrawer(ctx);

        startLeafAnimation(ctx, canvas, leaves, drawLeaf);

        return () => window.removeEventListener("resize", resize);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
        />
    )
}