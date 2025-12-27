import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export default function Pagination({
    currentPage,
    totalPages,
    totalElements,
    onPageChange,
    className,
}: PaginationProps) {
    const isFirstPage = currentPage === 0;
    const isLastPage = currentPage >= totalPages - 1;

    // Calculate page numbers to display
    const getPageNumbers = () => {
        const pages: (number | "...")[] = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            return Array.from({ length: totalPages }, (_, i) => i);
        }

        // Always show first page
        pages.push(0);

        if (currentPage > 2) {
            pages.push("...");
        }

        // Pages around current
        const start = Math.max(1, currentPage - 1);
        const end = Math.min(totalPages - 2, currentPage + 1);

        for (let i = start; i <= end; i++) {
            if (!pages.includes(i)) {
                pages.push(i);
            }
        }

        if (currentPage < totalPages - 3) {
            pages.push("...");
        }

        // Always show last page
        if (totalPages > 1 && !pages.includes(totalPages - 1)) {
            pages.push(totalPages - 1);
        }

        return pages;
    };

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4", className)}>
            {/* Info */}
            <p className="text-sm text-gt-text-muted order-2 sm:order-1">
                Page {currentPage + 1} sur {totalPages} ({totalElements} utilisateurs)
            </p>

            {/* Pagination controls */}
            <div className="flex items-center gap-1 order-1 sm:order-2">
                {/* First page */}
                <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => onPageChange(0)}
                    disabled={isFirstPage}
                    className="hidden sm:flex border-gt-border"
                    title="Première page"
                >
                    <ChevronsLeft size={16} />
                </Button>

                {/* Previous page */}
                <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={isFirstPage}
                    className="border-gt-border"
                    title="Page précédente"
                >
                    <ChevronLeft size={16} />
                </Button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) =>
                        page === "..." ? (
                            <span key={`ellipsis-${index}`} className="px-2 text-gt-text-muted">
                                ...
                            </span>
                        ) : (
                            <Button
                                key={page}
                                variant={page === currentPage ? "default" : "outline"}
                                size="icon-sm"
                                onClick={() => onPageChange(page)}
                                className={cn(
                                    page === currentPage
                                        ? "bg-gt-primary hover:bg-gt-primary-hover text-gt-primary-foreground"
                                        : "border-gt-border"
                                )}
                            >
                                {page + 1}
                            </Button>
                        )
                    )}
                </div>

                {/* Next page */}
                <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={isLastPage}
                    className="border-gt-border"
                    title="Page suivante"
                >
                    <ChevronRight size={16} />
                </Button>

                {/* Last page */}
                <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => onPageChange(totalPages - 1)}
                    disabled={isLastPage}
                    className="hidden sm:flex border-gt-border"
                    title="Dernière page"
                >
                    <ChevronsRight size={16} />
                </Button>
            </div>
        </div>
    );
}