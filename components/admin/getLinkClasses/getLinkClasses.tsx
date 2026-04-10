"use client";
import { usePathname } from "next/navigation";


export function getLinkClasses(path: string){
    const isActive=usePathname()===path;
    return `
        flex items-center gap-4 px-3 py-2 rounded-lg shadow-lg transition-all
        ${isActive ? "bg-muted font-bold border px-6 text-lg border border-primary/30 shadow-lg" : "hover:bg-muted/100 text-muted-foreground"}
    `
}