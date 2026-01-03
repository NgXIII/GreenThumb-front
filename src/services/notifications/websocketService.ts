import { Client, type IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import type { Notification } from '@/shared/types/notification';
import { useAccountStore } from '@/app/stores/userStore';

type NotificationCallback = (notification: Notification) => void;

class WebSocketService {
    private client: Client | null = null;
    private callbacks: Set<NotificationCallback> = new Set();
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 5000;
    private isConnecting = false;

    constructor() {
        this.client = null;
    }

    connect(): void {
        if (this.client?.active || this.isConnecting) {
            console.log('WebSocket already connected or connecting');
            return;
        }

        this.isConnecting = true;
        const token = useAccountStore.getState().account?.token;

        if (!token) {
            console.warn('No authentication token available for WebSocket connection');
            this.isConnecting = false;
            return;
        }

        this.client = new Client({
            webSocketFactory: () => new SockJS(`${import.meta.env.VITE_API_URL}/ws`),
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            debug: (str: string) => {
                if (import.meta.env.DEV) {
                    console.log('[WebSocket Debug]', str);
                }
            },
            reconnectDelay: this.reconnectDelay,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                console.log('WebSocket connected successfully');
                this.isConnecting = false;
                this.reconnectAttempts = 0;
                this.subscribeToNotifications();
            },
            onStompError: (frame) => {
                console.error('WebSocket STOMP error:', frame.headers['message']);
                console.error('Details:', frame.body);
                this.isConnecting = false;
            },
            onWebSocketClose: () => {
                console.log('WebSocket connection closed');
                this.isConnecting = false;
                this.handleReconnect();
            },
            onWebSocketError: (error) => {
                console.error('WebSocket error:', error);
                this.isConnecting = false;
            },
        });

        this.client.activate();
    }

    private handleReconnect(): void {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            setTimeout(() => {
                this.connect();
            }, this.reconnectDelay * this.reconnectAttempts);
        } else {
            console.error('Max reconnection attempts reached');
        }
    }

    private subscribeToNotifications(): void {
        if (!this.client?.connected) {
            console.warn('Cannot subscribe: WebSocket not connected');
            return;
        }

        this.client.subscribe('/user/queue/notifications', (message: IMessage) => {
            try {
                const notification: Notification = JSON.parse(message.body);
                console.log('Notification received:', notification);
                this.notifyCallbacks(notification);
            } catch (error) {
                console.error('Error parsing notification:', error);
            }
        });

        // Send subscription message to server
        this.client.publish({
            destination: '/app/notifications/subscribe',
            body: JSON.stringify({}),
        });
    }

    private notifyCallbacks(notification: Notification): void {
        this.callbacks.forEach((callback) => {
            try {
                callback(notification);
            } catch (error) {
                console.error('Error in notification callback:', error);
            }
        });
    }

    onNotification(callback: NotificationCallback): () => void {
        this.callbacks.add(callback);
        return () => {
            this.callbacks.delete(callback);
        };
    }

    disconnect(): void {
        if (this.client) {
            this.client.deactivate();
            this.client = null;
            this.callbacks.clear();
            this.reconnectAttempts = 0;
            this.isConnecting = false;
            console.log('WebSocket disconnected');
        }
    }

    isConnected(): boolean {
        return this.client?.connected ?? false;
    }
}

export const websocketService = new WebSocketService();
