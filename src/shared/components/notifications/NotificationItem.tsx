import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Bell, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import type { Notification, NotificationType } from '@/shared/types/notification';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

interface NotificationItemProps {
    notification: Notification;
    onMarkAsRead: (id: number) => void;
    onDelete: (id: number) => void;
}

const notificationTypeConfig: Record<
    NotificationType,
    { icon: React.ElementType; color: string; label: string }
> = {
    TASK_CREATED: {
        icon: Bell,
        color: 'text-gt-primary',
        label: 'Tâche créée',
    },
    TASK_DUE: {
        icon: AlertCircle,
        color: 'text-gt-yellow dark:text-gt-yellow-dark',
        label: 'Tâche échue',
    },
    TASK_COMPLETED: {
        icon: CheckCircle,
        color: 'text-gt-primary',
        label: 'Tâche complétée',
    },
    PLANT_CREATED: {
        icon: Bell,
        color: 'text-gt-primary',
        label: 'Plante créée',
    },
    SYSTEM: {
        icon: Bell,
        color: 'text-gt-text-muted',
        label: 'Système',
    },
};

export function NotificationItem({
    notification,
    onMarkAsRead,
    onDelete,
}: NotificationItemProps) {
    const config = notificationTypeConfig[notification.type];
    const Icon = config.icon;

    const handleMarkAsRead = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!notification.isRead) {
            onMarkAsRead(notification.id);
        }
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(notification.id);
    };

    const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
        addSuffix: true,
        locale: fr,
    });

    return (
        <div
            className={cn(
                'group relative flex gap-3 rounded-lg border border-gt-border p-3 transition-colors hover:bg-gt-surface-hover bg-gt-surface-elevated',
                !notification.isRead && 'bg-gt-primary/5 dark:bg-gt-primary/10'
            )}
        >
            <div className="flex-shrink-0">
                <Icon className={cn('h-5 w-5', config.color)} />
            </div>

            <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium leading-none text-gt-text">
                        {notification.title}
                    </p>
                    {!notification.isRead && (
                        <div className="h-2 w-2 rounded-full bg-gt-primary" />
                    )}
                </div>

                <p className="text-sm text-gt-text-muted">
                    {notification.message}
                </p>

                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-gt-border text-gt-text-muted">
                        {config.label}
                    </Badge>
                    <span className="text-xs text-gt-text-muted">{timeAgo}</span>
                </div>
            </div>

            <div className="flex flex-col gap-1 opacity-0 md:transition-opacity md:group-hover:opacity-100 md:opacity-0 opacity-100">
                {!notification.isRead && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gt-interactive hover:bg-gt-surface-hover hover:text-gt-interactive-hover"
                        onClick={handleMarkAsRead}
                        title="Marquer comme lu"
                    >
                        <CheckCircle className="h-4 w-4" />
                    </Button>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                    onClick={handleDelete}
                    title="Supprimer"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
