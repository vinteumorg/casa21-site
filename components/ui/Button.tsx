"use client";

import { type ReactNode } from "react";

interface ButtonProps {
    variant?: "primary" | "secondary";
    href?: string;
    children: ReactNode;
    showArrow?: boolean;
    onClick?: () => void;
    className?: string;
}

const ArrowIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
            d="M3 8h10M9 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default function Button({
    variant = "primary",
    href,
    children,
    showArrow = false,
    onClick,
    className = "",
}: ButtonProps) {
    const base =
        "inline-flex items-center gap-2.5 rounded-full transition-colors font-sans text-sm font-bold py-4 px-7";
    const variants = {
        primary: "bg-foreground text-white hover:bg-foreground/80",
        secondary:
            "bg-transparent text-foreground border border-foreground hover:bg-foreground/5",
    };
    const cls = `${base} ${variants[variant]} ${className}`;

    const content = (
        <>
            {children}
            {showArrow && <ArrowIcon />}
        </>
    );

    if (href) {
        return (
            <a href={href} className={cls}>
                {content}
            </a>
        );
    }

    return (
        <button type="button" className={cls} onClick={onClick}>
            {content}
        </button>
    );
}
