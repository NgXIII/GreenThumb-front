import type {Plant, Task} from "@/shared/types/plant.ts";
import EmptyState from "@/pages/Dashboard/EmptyState.tsx";

interface TaskCardProps {
    task: Task
}

export default function PlantTasks({ plant }: { plant: Plant | null }) {
    return (
        <section className="bg-gt-surface-elevated rounded-lg border border-gt-border overflow-hidden">
            {/* Header */}
            <div className="bg-gt-primary p-4">
                <h2 className="text-xl font-semibold text-gt-primary-foreground flex items-center gap-2">
                    ☑️ Tâches à effectuer
                </h2>
            </div>

            {/* Content */}
            <div className="p-6">
                {!plant?.tasks?.length ? (
                    <EmptyState
                        icon="✂️"
                        title="Sélectionne une plante"
                        description="Clique sur une plante pour voir ses tâches"
                    />
                ) : (
                    <div className="space-y-3">
                        {plant.tasks.map((task, index) => (
                            <div
                                key={index}
                                className="opacity-0 animate-[fadeInUp_0.4s_ease-out_forwards]"
                                style={{ animationDelay: `${0.1 + index * 0.08}s` }}
                            >
                                <TaskCard task={task} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </section>
    );
}

function TaskCard({ task }: TaskCardProps) {
    return (
        <div className="bg-gt-surface rounded-lg p-4 border border-gt-border hover:bg-gt-surface-hover transition-colors duration-200">
            <div className="flex items-start justify-between gap-4">
                <div
                    className="w-1 rounded-full flex-shrink-0 self-stretch"
                    style={{ backgroundColor: task.color }}
                    title="Niveau d'importance"
                />

                <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-1">
                        <h3 className="font-semibold text-gt-text flex-1">
                            {task.title}
                        </h3>
                    </div>

                    <p className="text-sm text-gt-text-muted mb-2">
                        {task.description}
                    </p>
                    <p className="text-xs text-gt-interactive font-medium">
                        📅 {new Date(task.endDate).toLocaleDateString("fr-FR")}
                    </p>
                </div>

                <button className="flex-shrink-0 bg-gt-primary hover:bg-gt-primary-hover text-gt-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                    Marquer fait ✓
                </button>
            </div>
        </div>
    );
}