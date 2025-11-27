import { motion, AnimatePresence } from "motion/react";
import { IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import React, { useEffect } from "react";

export const Modal = ({
    isOpen,
    onClose,
    children,
    className,
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className={cn(
                                "relative w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl pointer-events-auto overflow-hidden",
                                className
                            )}
                        >
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors z-10"
                            >
                                <IconX className="w-5 h-5" />
                            </button>
                            {children}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};
