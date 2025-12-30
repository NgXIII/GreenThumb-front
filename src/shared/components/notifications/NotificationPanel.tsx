import { Bell, CheckCheck, Loader2 } from 'lucide-react';
import { useNotifications } from '@/shared/hooks/useNotifications';
import { NotificationItem } from './NotificationItem';
import { Button } from '@/shared/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/shared/components/ui/popover';
import { Badge } from '@/shared/components/ui/badge';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { toast } from 'sonner';

export function NotificationPanel() {
    const {
        notifications,
        unreadCount,
        isLoading,
        markAsRead,
        markAllAsRead,
        deleteNotification,
    } = useNotifications();

    const handleMarkAsRead = async (id: number) => {
        try {
            await markAsRead(id);
        } catch {
            toast.error('Erreur lors du marquage de la notification');
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead();
            toast.success('Toutes les notifications ont été marquées comme lues');
        } catch {
            toast.error('Erreur lors du marquage des notifications');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteNotification(id);
            toast.success('Notification supprimée');
        } catch {
            toast.error('Erreur lors de la suppression de la notification');
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-gt-interactive hover:bg-gt-surface-hover transition-colors"
                >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge
                            className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-gt-primary text-gt-primary-foreground hover:bg-gt-primary-hover border-0"
                        >
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-[calc(100vw-2rem)] md:w-96 p-0 bg-gt-surface-elevated border-gt-border shadow-lg"
                align="end"
            >
                <div className="flex items-center justify-between border-b border-gt-border px-4 py-3 bg-gt-surface-elevated">
                    <h3 className="font-semibold text-gt-text">Notifications</h3>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleMarkAllAsRead}
                            className="h-8 gap-1 text-xs text-gt-interactive hover:bg-gt-surface-hover hover:text-gt-interactive-hover"
                        >
                            <CheckCheck className="h-4 w-4" />
                            <span className="hidden sm:inline">Tout marquer comme lu</span>
                            <span className="sm:hidden">Tout lire</span>
                        </Button>
                    )}
                </div>

                <ScrollArea className="h-[50vh] md:h-[400px]">
                    {isLoading ? (
                        <div className="flex h-full items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-gt-text-muted" />
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Bell className="h-12 w-12 text-gt-text-muted/50" />
                            <p className="mt-4 text-sm font-medium text-gt-text-muted">
                                Aucune notification
                            </p>
                            <p className="mt-1 text-xs text-gt-text-muted">
                                Vous n'avez pas encore de notifications
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2 p-3">
                            {notifications.map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                    onMarkAsRead={handleMarkAsRead}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}
