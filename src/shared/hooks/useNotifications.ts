import { useState, useEffect, useCallback } from 'react';
import { websocketService } from '@/services/notifications/websocketService';
import {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
} from '@/services/notifications/notificationApi';
import type { Notification } from '@/shared/types/notification';
import { useAuth } from './useAuth';

export function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const { account } = useAuth();

    const fetchNotifications = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getNotifications();
            setNotifications(data);
        } catch (err) {
            setError(err as Error);
            console.error('Error fetching notifications:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchUnreadCount = useCallback(async () => {
        try {
            const count = await getUnreadCount();
            setUnreadCount(count);
        } catch (err) {
            console.error('Error fetching unread count:', err);
        }
    }, []);

    const handleMarkAsRead = useCallback(async (notificationId: number) => {
        try {
            await markAsRead(notificationId);
            setNotifications((prev) =>
                prev.map((notif) =>
                    notif.id === notificationId ? { ...notif, isRead: true } : notif
                )
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Error marking notification as read:', err);
            throw err;
        }
    }, []);

    const handleMarkAllAsRead = useCallback(async () => {
        try {
            await markAllAsRead();
            setNotifications((prev) =>
                prev.map((notif) => ({ ...notif, isRead: true }))
            );
            setUnreadCount(0);
        } catch (err) {
            console.error('Error marking all notifications as read:', err);
            throw err;
        }
    }, []);

    const handleDeleteNotification = useCallback(async (notificationId: number) => {
        try {
            await deleteNotification(notificationId);
            setNotifications((prev) => {
                const notification = prev.find((n) => n.id === notificationId);
                if (notification && !notification.isRead) {
                    setUnreadCount((count) => Math.max(0, count - 1));
                }
                return prev.filter((notif) => notif.id !== notificationId);
            });
        } catch (err) {
            console.error('Error deleting notification:', err);
            throw err;
        }
    }, []);

    const handleNewNotification = useCallback((notification: Notification) => {
        setNotifications((prev) => [notification, ...prev]);
        if (!notification.isRead) {
            setUnreadCount((prev) => prev + 1);
        }
    }, []);

    useEffect(() => {
        if (!account) {
            setNotifications([]);
            setUnreadCount(0);
            setIsLoading(false);
            websocketService.disconnect();
            return;
        }

        fetchNotifications();
        fetchUnreadCount();

        websocketService.connect();
        const unsubscribe = websocketService.onNotification(handleNewNotification);

        return () => {
            unsubscribe();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account]);

    return {
        notifications,
        unreadCount,
        isLoading,
        error,
        markAsRead: handleMarkAsRead,
        markAllAsRead: handleMarkAllAsRead,
        deleteNotification: handleDeleteNotification,
        refreshNotifications: fetchNotifications,
        refreshUnreadCount: fetchUnreadCount,
    };
}
