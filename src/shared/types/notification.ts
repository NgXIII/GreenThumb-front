export const NotificationType = {
    TASK_CREATED: "TASK_CREATED",
    TASK_DUE: "TASK_DUE",
    TASK_COMPLETED: "TASK_COMPLETED",
    PLANT_CREATED: "PLANT_CREATED",
    SYSTEM: "SYSTEM",
} as const;

export type NotificationType = typeof NotificationType[keyof typeof NotificationType];

export interface Notification {
    id: number;
    title: string;
    message: string;
    type: NotificationType;
    isRead: boolean;
    createdAt: string;
    relatedEntityId: number | null;
}

export interface NotificationCountResponse {
    count: number;
}
