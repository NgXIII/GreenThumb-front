import * as React from "react";
import {motion} from "framer-motion";

export default function CardBase({ children }: { children: React.ReactNode }) {
    return (
        <motion.article
            whileHover={{ y: -6, scale: 1.03, boxShadow: "0 12px 20px rgba(0,0,0,0.08)" }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="bg-gt-surface-elevated rounded-2xl border border-gt-border overflow-hidden cursor-pointer flex flex-col text-left shadow-sm hover:shadow-md transition-colors duration-300"
        >
            {children}
        </motion.article>
    );
}