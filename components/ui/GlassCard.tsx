import { ReactNode } from "react";

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    title?: string;
}

export const GlassCard = ({ children, className = "", title }: GlassCardProps) => {
    return (
        <div
            className={`relative overflow-hidden rounded-xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-md transition-all hover:bg-white/20 hover:shadow-2xl ${className}`}
        >
            <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-secondary/20 blur-3xl" />

            {title && (
                <h3 className="mb-4 text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {title}
                </h3>
            )}

            <div className="relative z-10">{children}</div>
        </div>
    );
};
