import {useState} from "react";
import {useReportMessage} from "@/shared/hooks/forum/useReportMessage.ts";
import {AlertTriangle, X} from "lucide-react";

interface ReportDialogProps {
    messageId: number | null;
    onClose: () => void;
}

export default function ReportDialog({ messageId, onClose }: ReportDialogProps) {
    const [reason, setReason] = useState('');
    const reportMutation = useReportMessage();

    if (!messageId) return null;

    const handleSubmit = async () => {
        await reportMutation.mutateAsync({
            messageId,
            reason: reason.trim() || undefined
        });
        onClose();
        setReason('');
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn"
            onClick={onClose}
        >
            <div
                className="bg-gt-surface rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl border border-gt-border animate-scaleIn"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <h3 className="text-lg font-bold text-gt-text">Signaler ce message</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gt-surface-elevated rounded transition-colors"
                    >
                        <X className="w-5 h-5 text-gt-text-muted" />
                    </button>
                </div>

                {/* Description */}
                <p className="text-sm text-gt-text-muted mb-4">
                    Aidez-nous à maintenir une communauté respectueuse. Pourquoi signalez-vous ce message ?
                </p>

                {/* Textarea */}
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Ex: Contenu inapproprié, spam, harcèlement, désinformation..."
                    maxLength={500}
                    rows={5}
                    className="w-full p-3 bg-gt-surface-elevated border border-gt-border rounded-xl text-gt-text resize-none focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
                />

                <div className="flex items-center justify-between mt-2 text-xs text-gt-text-muted">
                    <span>Optionnel mais recommandé</span>
                    <span>{reason.length}/500</span>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onClose}
                        disabled={reportMutation.isPending}
                        className="flex-1 py-2.5 px-4 bg-gt-surface-elevated text-gt-text rounded-xl hover:bg-gt-border transition-colors disabled:opacity-50 font-medium"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={reportMutation.isPending}
                        className="flex-1 py-2.5 px-4 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg shadow-red-500/20"
                    >
                        {reportMutation.isPending ? (
                            <span className="flex items-center justify-center gap-2">
                                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                  </svg>
                                  Envoi...
                              </span>
                        ) : (
                            'Signaler'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}