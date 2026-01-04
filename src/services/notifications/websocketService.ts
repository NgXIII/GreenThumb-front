import {Client, type IMessage, type StompSubscription} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import type { Notification } from '@/shared/types/notification';
import { useAccountStore } from '@/app/stores/userStore';
import type {ChatMessage} from "@/shared/types/channel.ts";
import type {TierUpgradeNotification, UserStatsUpdate} from "@/shared/types/user.ts";

type NotificationCallback = (notification: Notification) => void;
type MessageCallback<T = unknown> = (message: T) => void;

interface Subscription {
    stompSubscription: StompSubscription;
    callback: MessageCallback<unknown>;
}

interface PendingSubscription {
    topic: string;
    callback: MessageCallback<unknown>;
}

class WebSocketService {
    private client: Client | null = null;
    private subscriptions: Map<string, Subscription> = new Map();
    private notificationCallbacks: Set<NotificationCallback> = new Set();
    private pendingSubscriptions: PendingSubscription[] = [];
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

                // Process pending subscriptions
                console.log(`Processing ${this.pendingSubscriptions.length} pending subscriptions...`);
                const pending = [...this.pendingSubscriptions];
                this.pendingSubscriptions = [];

                pending.forEach(({ topic, callback }) => {
                    console.log(`📌 Subscribing to pending topic: ${topic}`);
                    this.subscribe(topic, callback);
                });
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
            console.warn(`⏳ WebSocket not connected, queueing subscription to ${topic}`);

            const alreadyPending = this.pendingSubscriptions.some(sub => sub.topic === topic);
            if (!alreadyPending) {
                this.pendingSubscriptions.push({
                    topic,
                    callback: callback as MessageCallback<unknown>
                });
            }

            return () => {
                // Remove from pending if unsubscribed before connection
                const index = this.pendingSubscriptions.findIndex(sub => sub.topic === topic);
                if (index !== -1) {
                    this.pendingSubscriptions.splice(index, 1);
                }
            };
        }

        if (this.subscriptions.has(topic)) {
            console.log(`Already subscribed to ${topic}`);
            return () => this.unsubscribe(topic);
        }

        const stompSubscription = this.client.subscribe(topic, (message: IMessage) => {
            try {
                const data = JSON.parse(message.body) as T;
                callback(data);
            } catch (error) {
                console.error(`Error parsing message from ${topic}:`, error);
            }
        });

        this.subscriptions.set(topic, {
            stompSubscription,
            callback: callback as MessageCallback<unknown>
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
            this.pendingSubscriptions = [];

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

    public subscribeToUserStats(callback: (stats: UserStatsUpdate) => void): () => void {
        const topic = '/user/queue/stats';
        return this.subscribe<UserStatsUpdate>(topic, callback);
    }

    public subscribeToTierUpgrade(callback: (notification: TierUpgradeNotification) => void): () => void {
        const topic = '/user/queue/tier-upgrade';
        return this.subscribe<TierUpgradeNotification>(topic, callback);
    }
}

export const websocketService = new WebSocketService();
