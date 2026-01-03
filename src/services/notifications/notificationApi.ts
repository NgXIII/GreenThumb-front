import apiClient from '@/services/http/apiClient';
import type { Notification, NotificationCountResponse } from '@/shared/types/notification';

export async function getNotifications(): Promise<Notification[]> {
    const response = await apiClient.get<Notification[]>('/notifications');
    return response.data;
}

export async function getUnreadNotifications(): Promise<Notification[]> {
    const response = await apiClient.get<Notification[]>('/notifications/unread');
    return response.data;
}

export async function getUnreadCount(): Promise<number> {
    const response = await apiClient.get<NotificationCountResponse>('/notifications/unread/count');
    return response.data.count;
}

export async function markAsRead(notificationId: number): Promise<void> {
    await apiClient.patch(`/notifications/${notificationId}/read`);
}

export async function markAllAsRead(): Promise<void> {
    await apiClient.patch('/notifications/read-all');
}

export async function deleteNotification(notificationId: number): Promise<void> {
    await apiClient.delete(`/notifications/${notificationId}`);
}
