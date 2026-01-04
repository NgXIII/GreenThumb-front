import {MessageCircle, Image as ImageIcon, ExternalLink, Flag} from 'lucide-react';
import type { Message } from "@/shared/types/channel.ts";
import { useState } from 'react';
import resolveAvatar from "@/shared/utils/resolveAvatar.ts";
import ReportDialog from "@/pages/forumPage/ReportDialog.tsx";

interface MessageListViewProps {
  messages: Message[];
}

export default function MessageListView({ messages }: MessageListViewProps) {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
    const [reportingMessageId, setReportingMessageId] = useState<number | null>(null);

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
          const isToday = new Date().toDateString() === messageDate.toDateString();
          const timeStr = messageDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
          const dateStr = messageDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

          return (
            <div
              key={message.idMessage}
              className="group relative animate-fadeIn"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              {/* Message Card */}
              <div className="flex gap-4 p-5 rounded-2xl bg-gradient-to-br from-white to-gray-50/50 dark:from-gt-surface dark:to-gt-surface-elevated/30 border border-gray-200/50 dark:border-gt-border/40 hover:border-gt-primary/30 hover:shadow-xl hover:shadow-gt-primary/5 transition-all duration-300">

                {/* Avatar with online indicator */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gt-primary via-gt-primary-dark to-emerald-700 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-gt-primary/20 ring-4 ring-white/10 group-hover:ring-gt-primary/20 group-hover:scale-105 transition-all duration-300">
                      {message.author.substring(0, 2).toUpperCase()}
                    </div>
                    {/* Online indicator */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-gt-surface rounded-full shadow-sm"></div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-3">
                  {/* Header */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <h4 className="font-bold text-gt-text text-lg hover:text-gt-primary transition-colors cursor-pointer">
                      {message.author}
                    </h4>

                    {/* Badge membre */}
                      <span className="px-2.5 py-1 bg-gradient-to-r from-gt-primary/10 to-emerald-500/10 border border-gt-primary/20 text-gt-primary text-xs font-semibold rounded-lg">
                          Membre
                      </span>

                    {/* Timestamp */}
                      <div className="flex items-center gap-2 text-xs text-gt-text-muted">
                          <span className="hidden sm:inline">{isToday ? "Aujourd'hui" : dateStr}</span>
                          <span className="font-medium text-gt-primary">{timeStr}</span>
                      </div>

                      <button
                          onClick={() => {
                              setReportingMessageId(message.idMessage)
                          }}
                          className="ml-auto p-2 hover:bg-red-500/10 rounded-lg transition-all duration-200 group/report"
                          title="Signaler ce message"
                          aria-label="Signaler ce message"
                      >
                          <Flag className="w-4 h-4 text-gt-text-muted group-hover/report:text-red-500 transition-colors" />
                      </button>
                  </div>

                  {/* Message Text */}
                  {message.text && (
                    <div className="prose prose-sm max-w-none">
                      <p className="text-base text-gt-text leading-relaxed whitespace-pre-wrap m-0">
                        {message.text}
                      </p>
                    </div>
                  )}

                  {/* Images Gallery */}
                  {message.mediaUrls && message.mediaUrls.length > 0 && (
                    <div className="space-y-2">
                      {/* Image count badge */}
                      <div className="flex items-center gap-2 text-sm text-gt-text-muted">
                        <ImageIcon className="w-4 h-4 text-gt-primary" />
                        <span className="font-medium">{message.mediaUrls.length} {message.mediaUrls.length > 1 ? 'images' : 'image'}</span>
                      </div>

                      {/* Images Grid */}
                      <div className={`grid gap-3 ${
                        message.mediaUrls.length === 1 ? 'grid-cols-1' :
                        message.mediaUrls.length === 2 ? 'grid-cols-2' :
                        'grid-cols-2 sm:grid-cols-3'
                      }`}>
                        {message.mediaUrls.map((url, imgIndex) => (
                          <div
                            key={`${message.idMessage}-img-${imgIndex}`}
                            className="relative group/img rounded-xl overflow-hidden border-2 border-gray-200/50 dark:border-gt-border/50 hover:border-gt-primary/60 transition-all duration-300 cursor-zoom-in shadow-md hover:shadow-xl hover:shadow-gt-primary/10"
                            onClick={() => setLightboxImage(url)}
                          >
                            <img
                              src={resolveAvatar(url)}
                              alt={`Photo ${imgIndex + 1} partagée par ${message.author}`}
                              className="w-full h-48 object-cover group-hover/img:scale-110 transition-transform duration-500"
                              loading="lazy"
                            />

                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300">
                              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                                <span className="text-xs font-medium bg-black/40 px-2 py-1 rounded backdrop-blur-sm">
                                  Photo {imgIndex + 1}
                                </span>
                                <ExternalLink className="w-4 h-4" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
