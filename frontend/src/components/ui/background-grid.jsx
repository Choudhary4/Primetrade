import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export const BackgroundGrid = ({ children, className }) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (event) => {
            setMousePosition({ x: event.clientX, y: event.clientY });
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <div className={cn("relative min-h-screen w-full bg-black overflow-hidden", className)}>
            <div
                className="absolute inset-0 z-0 transition-opacity duration-300"
                style={{
                    background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,0,0,0.15), transparent 40%)`,
                }}
            />
            <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            {/* Red grid hover effect */}
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    background: `radial-gradient(200px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(220, 38, 38, 0.1), transparent 80%)`,
                }}
            />

            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};
