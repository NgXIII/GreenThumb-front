import type {Plant, Task} from "@/shared/types/plant.ts";
import {motion} from "framer-motion";
import EmptyState from "@/pages/Dashboard/EmptyState.tsx";

interface TaskCardProps {
    task: Task
    index: number;
}

export default function PlantTasks({ plant }: { plant: Plant | null }) {
    return (
        <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gt-surface-elevated rounded-lg border border-gt-border overflow-hidden"
        >
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
                            <TaskCard key={index} task={task} index={index} />
                        ))}
                    </div>
                )}
            </div>
        </motion.section>
    );
}

function TaskCard({ task, index }: TaskCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-gt-surface rounded-lg p-4 border border-gt-border hover:bg-gt-surface-hover transition-colors duration-200"
        >
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
        </motion.div>
    );
}