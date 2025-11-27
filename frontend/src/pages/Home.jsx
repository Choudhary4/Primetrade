import React from "react";
import { cn } from "@/lib/utils";
import { Spotlight } from "@/components/ui/spotlight";
import Navbar from "@/components/Navbar";

export default function Home() {
    return (
        <div className="min-h-screen w-full bg-transparent antialiased relative overflow-hidden">
            <Spotlight
                className="-top-40 left-0 md:-top-20 md:left-60"
                fill="white"
            />
            <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-32">
                <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
                    Scalable Web App <br /> with Modern UI.
                </h1>
                <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
                    A full-stack application built with React, Node.js, and MongoDB.
                    Featuring a modern design with Aceternity UI components,
                    secure authentication, and a responsive dashboard.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <a href="/dashboard" className="px-8 py-3 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200">
                        Go to Dashboard
                    </a>
                </div>
            </div>
        </div>

    );
}
