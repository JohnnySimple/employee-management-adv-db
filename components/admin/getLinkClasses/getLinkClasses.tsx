"use client";
import { usePathname } from "next/navigation";


export function getLinkClasses(path: string){
    const isActive=usePathname()===path;
    return `
        flex items-center gap-4 px-3 py-2 rounded-lg transition-all
        ${isActive ? "bg-muted font-bold border px-8 text-lg border border-primary/30 shadow-sm" : "hover:bg-muted text-muted-foreground"}
    `
}