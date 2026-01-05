import {MessageCircle, ExternalLink, Flag} from 'lucide-react';
import type { Message } from "@/shared/types/channel.ts";
import { useState, useEffect, type RefObject } from 'react';
import resolveAvatar from "@/shared/utils/resolveAvatar.ts";
import ReportDialog from "@/pages/forumPage/ReportDialog.tsx";
import { useUserMap } from "@/shared/hooks/useUserMap.ts";
import { useNavigate } from "react-router-dom";
import MessageReactions from "@/pages/forumPage/MessageReactions.tsx";

interface MessageListViewProps {
  messages: Message[];
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  currentUsername?: string;
  onToggleReaction: (messageId: number, emoji: string) => void;
}

export default function MessageListView({ messages, scrollContainerRef, currentUsername, onToggleReaction }: MessageListViewProps) {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [reportingMessageId, setReportingMessageId] = useState<number | null>(null);
  const { userMap } = useUserMap(messages);

    console.log(messages);

  const navigate = useNavigate();

  useEffect(() => {
    if (messages.length > 0 && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, scrollContainerRef]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <div className="absolute inset-0 bg-gt-primary/10 blur-3xl rounded-full"></div>
          <MessageCircle className="relative w-20 h-20 text-gt-primary mx-auto mb-6 opacity-40" strokeWidth={1.5}/>
        </div>
        <h3 className="text-xl font-bold text-gt-text mb-2">Aucun message pour l'instant</h3>
        <p className="text-sm text-gt-text-muted max-w-sm text-center">
          Lancez la conversation ! Soyez le premier à partager vos idées et photos de plantes.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {messages.map((message, index) => {
          const messageDate = new Date(message.timestamp);
          const timeStr = messageDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
          const userInfo = userMap.get(message.author);

          return (
            <div
              key={message.idMessage}
              className="group relative animate-fadeIn hover:bg-gt-surface/30 dark:hover:bg-gt-surface-elevated/30 px-4 py-2 rounded-md transition-colors"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              {/* Message - Discord Style */}
              <div className="flex gap-4">

                {/* Avatar */}
                <div className="flex-shrink-0 mt-1">
                  <div className="relative">
                    {userInfo?.avatar ? (
                      <img
                        src={resolveAvatar(userInfo.avatar)}
                        alt={`Avatar de ${message.author}`}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gt-primary via-gt-primary-dark to-emerald-700 flex items-center justify-center text-white font-bold text-sm">
                        {message.author.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1">
                  {/* Header - Discord Style */}
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span
                        className="font-semibold text-gt-text hover:underline cursor-pointer"
                        onClick={() => navigate(`/profil/${message.author}`)}
                    >
                      {message.author}
                    </span>

                    {/* Badge role/tier */}
                    {userInfo && (
                      userInfo.role === 'SUPER_ADMIN' ? (
                        <span className="px-1.5 py-0.5 bg-purple-600 dark:bg-purple-500 text-white text-[10px] font-bold rounded uppercase">
                          Super Admin
                        </span>
                      ) : userInfo.role === 'ADMIN' ? (
                        <span className="px-1.5 py-0.5 bg-red-600 dark:bg-red-500 text-white text-[10px] font-bold rounded uppercase">
                          Admin
                        </span>
                      ) : userInfo.role === 'MODERATEUR' ? (
                        <span className="px-1.5 py-0.5 bg-blue-600 dark:bg-blue-500 text-white text-[10px] font-bold rounded uppercase">
                          Mod
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 bg-gt-primary text-white text-[10px] font-semibold rounded">
                          {userInfo.tier.name}
                        </span>
                      )
                    )}

                    {/* Timestamp */}
                    <span className="text-xs text-gt-text-muted">
                      {timeStr}
                    </span>

                    <button
                      onClick={() => {
                        setReportingMessageId(message.idMessage)
                      }}
                      className="ml-auto p-1.5 hover:bg-red-500/10 rounded transition-colors opacity-0 group-hover:opacity-100"
                      title="Signaler ce message"
                      aria-label="Signaler ce message"
                    >
                      <Flag className="w-4 h-4 text-gt-text-muted hover:text-red-500 transition-colors" />
                    </button>
                  </div>

                  {/* Message Text */}
                  {message.text && (
                    <p className="text-sm text-gt-text leading-relaxed whitespace-pre-wrap">
                      {message.text}
                    </p>
                  )}

                  {/* Images - Discord Style */}
                  {message.mediaUrls && message.mediaUrls.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {message.mediaUrls.map((url, imgIndex) => (
                        <div
                          key={`${message.idMessage}-img-${imgIndex}`}
                          className="relative rounded-md overflow-hidden cursor-pointer group/img"
                          onClick={() => setLightboxImage(url)}
                          style={{
                            maxWidth: (message.mediaUrls?.length ?? 0) === 1 ? '400px' : '300px',
                            maxHeight: '300px'
                          }}
                        >
                          <img
                            src={resolveAvatar(url)}
                            alt={`Photo ${imgIndex + 1} partagée par ${message.author}`}
                            className="rounded-md object-cover w-full h-full hover:opacity-90 transition-opacity"
                            loading="lazy"
                            style={{
                              maxHeight: '300px'
                            }}
                          />

                          {/* Hover effect */}
                          <div className="absolute top-2 right-2 opacity-0 group-hover/img:opacity-100 transition-opacity">
                            <ExternalLink className="w-5 h-5 text-white drop-shadow-lg" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reactions */}
                  <MessageReactions
                    reactions={message.reactions}
                    currentUsername={currentUsername}
                    onToggleReaction={(emoji) => onToggleReaction(message.idMessage, emoji)}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            onClick={() => setLightboxImage(null)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <img
            src={lightboxImage}
            alt="Image agrandie"
            className="max-w-full max-h-full rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

        <ReportDialog
            messageId={reportingMessageId}
            onClose={() => setReportingMessageId(null)}
        />
    </>
  );
}
