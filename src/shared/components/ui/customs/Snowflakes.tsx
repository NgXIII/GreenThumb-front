import {useEffect, useRef} from "react";

function setupCanvasResize(canvas: HTMLCanvasElement) {
    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resize();
    return resize;
}

function generateFlakes(canvas: HTMLCanvasElement) {
    return Array.from({ length: 30 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 3 + Math.random() * 3,
        speed: 0.4 + Math.random() * 0.8,
        drift: (Math.random() - 0.5) * 1.5,
        rotation: Math.random() * 360,
    }));
}

function drawFlake(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    rotation: number
) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    ctx.lineWidth = 1.4;

    for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -size);
        ctx.stroke();

        // petites branches
        ctx.beginPath();
        ctx.moveTo(0, -size * 0.5);
        ctx.lineTo(size * 0.2, -size * 0.3);
        ctx.moveTo(0, -size * 0.5);
        ctx.lineTo(-size * 0.2, -size * 0.3);
        ctx.stroke();

        ctx.rotate(Math.PI / 3);
    }

    ctx.restore();
}
function startFlakesAnimation(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    flakes: {
        x: number;
        y: number;
        size: number;
        speed: number;
        drift: number;
        rotation: number;
    }[]
) {
    let animationId: number;
    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (const f of flakes) {
            drawFlake(ctx, f.x, f.y, f.size, f.rotation);
            f.y += f.speed;
            f.x += Math.sin(f.y / 50) * f.drift;
            f.rotation += f.drift * 0.3;

            if (f.y > canvas.height + 5) {
                f.y = -10;
                f.x = Math.random() * canvas.width;
            }
        }

        animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
}

export default function Snowflakes(){
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

        const flakes = generateFlakes(canvas);
        const cancelAnimation = startFlakesAnimation(ctx, canvas, flakes);

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimation();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
        />
    )
}