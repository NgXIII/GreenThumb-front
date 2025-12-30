import { useEffect } from 'react';
import { toast } from 'sonner';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/shared/hooks/useNotifications';

export function NotificationToastProvider() {
    const { notifications } = useNotifications();

    useEffect(() => {
        if (notifications.length > 0) {
            const latestNotification = notifications[0];

            // Only show toast for unread notifications
            if (!latestNotification.isRead) {
                toast(latestNotification.title, {
                    description: latestNotification.message,
                    icon: <Bell className="h-4 w-4" />,
                    duration: 5000,
                });
            }
        }
    }, [notifications]);

    return null;
}
