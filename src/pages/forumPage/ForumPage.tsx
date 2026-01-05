import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useGetChannels from "@/shared/hooks/forum/useGetChannel.ts";
import type { Thread, Message, ChatMessage, ForumWebSocketMessage } from "@/shared/types/channel.ts";
import { chatMessageToMessage, isModerationEvent, isRestoredEvent } from "@/shared/types/channel.ts";
import Sidebar from "./Sidebar.tsx";
import ForumHeader from "./ForumHeader.tsx";
import ThreadListView from "./ThreadListView.tsx";
import MessageListView from "./MessageListView.tsx";
import MessageInput from "./MessageInput.tsx";
import {useUserStore} from "@/app/stores/userStore.ts";
import { websocketService } from "@/services/notifications/websocketService.ts";
import {toast} from "sonner";
import type {TierUpgradeNotification} from "@/shared/types/user.ts";
import TierUpgradeModal from "@/pages/forumPage/TierUpgradeModal.tsx";
import useReactions from "@/shared/hooks/forum/useReactions.ts";

export default function ForumPage() {
  const location = useLocation();
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [expandedChannels, setExpandedChannels] = useState<Set<string>>(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [threadMessages, setThreadMessages] = useState<Message[]>([]);
  const [tierUpgradeNotification, setTierUpgradeNotification] = useState<TierUpgradeNotification | null>(null)

  const hasInitialized = useRef(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { user } = useUserStore();

  const { channels, error, loading, refetch } = useGetChannels();

  const { toggleReaction } = useReactions({
    threadId: selectedThread?.id ?? null,
    messages: threadMessages,
    setMessages: setThreadMessages
  });

  const currentChannel = channels?.find((c) => c.name === selectedChannel) || channels?.[0];

  const threads = currentChannel?.threads?.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  }) || [];

  useEffect(() => {
    if (channels && channels.length > 0 && !hasInitialized.current) {
      setSelectedChannel(channels[0].name);
      hasInitialized.current = true;
    }
  }, [channels]);

  // Restaurer le channel et thread quand on revient de la page profil
  useEffect(() => {
    if (!channels || channels.length === 0) return;

    const state = location.state as { selectedChannel?: string; selectedThreadId?: number } | null;

    if (state?.selectedChannel && state?.selectedThreadId) {
      // Restaurer le channel
      setSelectedChannel(state.selectedChannel);

      // Trouver et restaurer le thread
      for (const channel of channels) {
        const thread = channel.threads?.find(t => t.id === state.selectedThreadId);
        if (thread) {
          setSelectedThread(thread);
          break;
        }
      }
    }
  }, [location.state, channels]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    setSelectedThread(null);
  }, [selectedChannel]);

  useEffect(() => {
    websocketService.connect();

    if (user?.username) {
      const unsubscribeStats = websocketService.subscribeToUserStats(
        (statsUpdate) => {
          useUserStore.getState().updateStats(
            statsUpdate.messageCount,
            statsUpdate.tier,
            statsUpdate.countCreatedThread
          );
        }
      );

      const unsubscribeTierUpgrade = websocketService.subscribeToTierUpgrade(
          (notification) => {
            setTierUpgradeNotification(notification);
          }
      );

      return () => {
        unsubscribeStats();
        unsubscribeTierUpgrade();
        websocketService.disconnect();
      };
    }

    return () => {
      websocketService.disconnect();
    };
  }, [user?.username]);

  useEffect(() => {
    if (!selectedThread) {
      setThreadMessages([]);
      return;
    }

    setThreadMessages(selectedThread.messages || []);

    const unsubscribe = websocketService.subscribeToThread(
        selectedThread.id,
        (data: ForumWebSocketMessage) => {
          if (isModerationEvent(data)) {
            console.log(`Message ${data.messageId} removed by AI moderation`);
            console.log(`Reason: ${data.reason}`);

            setThreadMessages((prevMessages) =>
              prevMessages.filter(msg => msg.idMessage !== data.messageId)
            );

            toast.info("Un message a été supprimé par la modération automatique");
          } else if (isRestoredEvent(data)) {
            console.log(`Message ${data.messageId} restored by moderator`);
            console.log(`Reason: ${data.reason}`);

            const restoredMessage: Message = {
              idMessage: data.messageId,
              text: data.text,
              author: data.author,
              timestamp: data.timestamp,
              mediaUrls: []
            };

            setThreadMessages((prevMessages) => {
              const messageExists = prevMessages.some(msg => msg.idMessage === data.messageId);
              if (messageExists) {
                return prevMessages;
              }
              return [...prevMessages, restoredMessage].sort(
                (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
              );
            });

            toast.success("Un message a été restauré après révision humaine");
          } else {
            const newMessage = chatMessageToMessage(data);

            setThreadMessages((prevMessage) => {
              const messageExists = prevMessage.some(msg => msg.idMessage === newMessage.idMessage);

              if (messageExists) {
                return prevMessage;
              }

              return [...prevMessage, newMessage];
            });
          }
        }
    );

    return () => {
      unsubscribe();
    };
  }, [selectedThread]);

  const toggleChannel = (channelName: string) => {
    const newExpanded = new Set(expandedChannels);
    if (newExpanded.has(channelName)) {
      newExpanded.delete(channelName);
    } else {
      newExpanded.add(channelName);
    }
    setExpandedChannels(newExpanded);
  };

  const handleSelectThread = (channel: string, thread: Thread) => {
    setSelectedChannel(channel);
    setSelectedThread(thread);
  };

  const handleBackToThreads = () => {
    setSelectedThread(null);
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSendMessage = async (text: string, mediaUrls?: string[]) => {
    if (!selectedThread) {
      return;
    }

    if (!user?.username) {
      return;
    }

    const chatMessage: ChatMessage = {
      idMessage: null,
      idThread: selectedThread.id,
      username: user.username,
      text: text,
      timestamp: new Date().toISOString(),
      mediaUrls: mediaUrls || [],
    };

    try {
      websocketService.sendForumMessage(chatMessage);

      setTimeout(() => refetch(), 500);
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  const handleMessageClick = (messageId: number) => {
    const messageElement = document.getElementById(`message-${messageId}`);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Highlight effect
      messageElement.classList.add('bg-gt-primary/10');
      setTimeout(() => {
        messageElement.classList.remove('bg-gt-primary/10');
      }, 2000);
    }
  }

  return (
      <>
        <div className="flex bg-gradient-to-br from-gt-surface via-gt-surface to-gt-surface/95 overflow-hidden" style={{height: 'calc(100vh - 4rem)'}}>
          <Sidebar
              user={user}
              isOpen={isSidebarOpen}
              channels={channels}
              loading={loading}
              error={error}
              selectedChannel={selectedChannel}
              selectedThread={selectedThread}
              expandedChannels={expandedChannels}
              onSelectChannel={setSelectedChannel}
              onSelectThread={handleSelectThread}
              onToggleChannel={toggleChannel}
              onChannelCreated={refetch}
          />

          <div className="flex-1 flex flex-col min-w-0">
            <ForumHeader
                isSidebarOpen={isSidebarOpen}
                currentChannel={currentChannel}
                selectedThread={selectedThread}
                threadMessages={threadMessages}
                onToggleSidebar={handleToggleSidebar}
                onBackToThreads={handleBackToThreads}
                onMessageClick={handleMessageClick}
            />

            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6">
              {selectedThread ? (
                  <MessageListView
                    messages={threadMessages}
                    scrollContainerRef={messagesContainerRef}
                    currentUsername={user?.username}
                    onToggleReaction={toggleReaction}
                    selectedChannel={selectedChannel}
                    selectedThreadId={selectedThread.id}
                  />
              ) : (
                  <ThreadListView threads={threads} onSelectThread={setSelectedThread} />
              )}
            </div>

            <div className="p-6 border-t border-gt-border/50 bg-gt-surface-elevated/80 backdrop-blur-sm shadow-lg">
              <div className="max-w-4xl mx-auto">
                <MessageInput
                    selectedThread={selectedThread}
                    role={user?.role}
                    tier={user?.tier}
                    channelName={currentChannel?.name}
                    user={user}
                    countCreatedThread={user?.countCreatedThread}
                    onThreadCreated={refetch}
                    onSendMessage={handleSendMessage}
                />
              </div>
            </div>
          </div>
        </div>

        <TierUpgradeModal
            notification={tierUpgradeNotification}
            onClose={() => setTierUpgradeNotification(null)}
        />
      </>
  );
}
