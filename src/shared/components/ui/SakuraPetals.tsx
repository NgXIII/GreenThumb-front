import {useEffect, useRef} from "react";

function setupCanvasResize(canvas: HTMLCanvasElement) {
    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resize();
    return resize;
}

function generatePetals(canvas: HTMLCanvasElement) {
    return Array.from({ length: 50 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 8 + Math.random() * 8,
        speed: 0.6 + Math.random() * 0.8,
        drift: (Math.random() - 0.5) * 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.2,
        color:
            Math.random() > 0.5
                ? "rgba(255, 182, 193, 0.8)" // rose clair
                : "rgba(255, 192, 203, 0.9)", // rose pastel
    }));
}

function drawPetal(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    rotation: number,
    color: string
) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);

    ctx.fillStyle = color;
    ctx.shadowColor = "rgba(255, 105, 180, 0.4)";
    ctx.shadowBlur = 6;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(size / 2, -size / 3, 0, -size);
    ctx.quadraticCurveTo(-size / 2, -size / 3, 0, 0);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
}
function startPetalAnimation(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    petals: {
        x: number;
        y: number;
        size: number;
        speed: number;
        drift: number;
        rotation: number;
        rotationSpeed: number;
        color: string;
    }[]
) {
    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (const p of petals) {
            drawPetal(ctx, p.x, p.y, p.size, p.rotation, p.color);

            p.y += p.speed;
            p.x += Math.sin(p.y / 40) * p.drift * 1.5;
            p.rotation += p.rotationSpeed;

            if (p.y > canvas.height + 20) {
                p.y = -10;
                p.x = Math.random() * canvas.width;
            }
        }

        requestAnimationFrame(animate);
    };

    animate();
}

export default function SakuraPetals() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = setupCanvasResize(canvas);
        window.addEventListener("resize", resize);

        const petals = generatePetals(canvas);
        startPetalAnimation(ctx, canvas, petals);

        return () => window.removeEventListener("resize", resize);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
        />
    );
}