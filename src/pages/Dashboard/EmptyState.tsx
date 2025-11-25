interface EmptyStateProps {
    icon: string;
    title: string;
    description: string;
}

export default function EmptyState({ icon, title, description }: EmptyStateProps) {
    return (
        <div className="text-center py-8">
            <div className="text-6xl mb-4">{icon}</div>
            <h3 className="text-lg font-semibold text-gt-text mb-2">
                {title}
            </h3>
            <p className="text-gt-text-muted">
                {description}
            </p>
        </div>
    );
}