import {Client, type IMessage, type StompSubscription} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import type { Notification } from '@/shared/types/notification';
import { useAccountStore } from '@/app/stores/userStore';
import type {ChatMessage} from "@/shared/types/channel.ts";

type NotificationCallback = (notification: Notification) => void;
type MessageCallback<T = unknown> = (message: T) => void;

interface Subscription {
    stompSubscription: StompSubscription;
    callback: MessageCallback<never>;
}

class WebSocketService {
    private client: Client | null = null;
    private subscriptions: Map<string, Subscription> = new Map();
    private notificationCallbacks: Set<NotificationCallback> = new Set();
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

    public subscribe<T = unknown>(topic: string, callback: MessageCallback<T>): () => void {
        if (!this.client?.connected) {
            console.warn(`Cannot subscribe to ${topic}: WebSocket not connected`);
            return () => {}
        }

        if (this.subscriptions.has(topic)) {
            console.log(`Already subscribed to ${topic}`);
            return () => this.unsubscribe(topic);
        }

        const stompSubscription = this.client.subscribe(topic, (message: IMessage) => {
            try {
                const data = JSON.parse(message.body);
                callback(data);
            } catch (error) {
                console.error(`Error parsing message from ${topic}:`, error);
            }
        });

        this.subscriptions.set(topic, {
            stompSubscription,
            callback
        });

        console.log(`✅ Subscribed to ${topic}`);

        return () => this.unsubscribe(topic);
    }

    public unsubscribe(topic: string): void {
        const subscription = this.subscriptions.get(topic);

        if (!subscription) {
            console.warn(`Not subscribed to ${topic}`);
            return;
        }

        subscription.stompSubscription.unsubscribe();

        this.subscriptions.delete(topic);

        console.log(`❌ Unsubscribed from ${topic}`);
    }

    public publish(destination: string, body: unknown): void {
        if (!this.client?.connected) {
            console.error('Cannot publish: WebSocket not connected');
            throw new Error('WebSocket not connected');
        }

        this.client.publish({
            destination,
            body: JSON.stringify(body),
        });

        console.log(`📤 Message published to ${destination}`);
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

    public subscribeToNotifications(): void {
        this.subscribe<Notification>('/user/queue/notifications', (notification) => {
            console.log('Notification received:', notification);
            this.notifyNotificationCallbacks(notification);
        });

        this.publish('/app/notifications/subscribe', {});
    }

    private notifyNotificationCallbacks(notification: Notification): void {
        this.notificationCallbacks.forEach((callback) => {
            try {
                callback(notification);
            } catch (error) {
                console.error('Error in notification callback:', error);
            }
        });
    }

    onNotification(callback: NotificationCallback): () => void {
        this.notificationCallbacks.add(callback);
        return () => {
            this.notificationCallbacks.delete(callback);
        };
    }

    disconnect(): void {
        if (this.client) {
            this.subscriptions.forEach((subscription) => {
                subscription.stompSubscription.unsubscribe();
            });
            this.subscriptions.clear();

            this.notificationCallbacks.clear();

            this.client.deactivate();
            this.client = null;
            this.reconnectAttempts = 0;
            this.isConnecting = false;
            console.log('WebSocket disconnected');
        }
    }

    isConnected(): boolean {
        return this.client?.connected ?? false;
    }

    public subscribeToThread(threadId: number, callback: (message: ChatMessage) => void): () => void {
        const topic = `/topic/forum/${threadId}`;
        return this.subscribe<ChatMessage>(topic, callback);
    }

    public unsubscribeFromThread(threadId: number): void {
        const topic = `/topic/forum/${threadId}`;
        this.unsubscribe(topic);
    }

    public sendForumMessage(message: ChatMessage): void {
        this.publish('/app/forum/send', message);
    }
}

export const websocketService = new WebSocketService();
