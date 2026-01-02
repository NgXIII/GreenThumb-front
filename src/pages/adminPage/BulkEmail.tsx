import { Mail, Send, X, AlertCircle, CheckCircle2, XCircle, RotateCcw, Users, Shield, UserCheck } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Label } from '@/shared/components/ui/label';
import useBulkEmail from '@/shared/hooks/useBulkEmail';
import ConfirmationModal from './components/ConfirmationModal';
import { cn } from '@/shared/lib/utils';
import type { RecipientType } from '@/services/repos/adminService';

const MAX_SUBJECT_LENGTH = 200;
const MAX_CONTENT_LENGTH = 5000;

interface RecipientTypeOption {
    value: RecipientType;
    label: string;
    description: string;
    icon: typeof Users;
    color: string;
    disabled?: boolean;
}

const recipientTypes: RecipientTypeOption[] = [
    {
        value: 'ALL_USERS',
        label: 'Utilisateurs standards',
        description: 'Tous les utilisateurs actifs (hors staff)',
        icon: Users,
        color: 'blue'
    },
    {
        value: 'STAFF_ONLY',
        label: 'Équipe Staff',
        description: 'Admins et Modérateurs uniquement',
        icon: Shield,
        color: 'purple'
    },
    {
        value: 'SPECIFIC_USERS',
        label: 'Sélection spécifique',
        description: 'Liste personnalisée d\'utilisateurs',
        icon: UserCheck,
        color: 'green',
        disabled: true
    }
];

export default function BulkEmail() {
    const {
        formData,
        validationErrors,
        loading,
        showConfirmModal,
        stats,
        isFormValid,
        updateField,
        resetForm,
        openConfirmModal,
        closeConfirmModal,
        sendEmail,
        dismissStats,
    } = useBulkEmail();

    const subjectCharsRemaining = MAX_SUBJECT_LENGTH - formData.subject.length;
    const contentCharsRemaining = MAX_CONTENT_LENGTH - formData.content.length;

    // Get confirmation message based on recipient type
    const getConfirmationMessage = () => {
        switch (formData.recipientType) {
            case 'ALL_USERS':
                return 'Vous êtes sur le point d\'envoyer cet email à tous les utilisateurs actifs de la plateforme (hors staff). Cette action est irréversible. Voulez-vous continuer ?';
            case 'STAFF_ONLY':
                return 'Vous êtes sur le point d\'envoyer cet email à tous les membres du staff (admins et modérateurs). Cette action est irréversible. Voulez-vous continuer ?';
            case 'SPECIFIC_USERS':
                return 'Vous êtes sur le point d\'envoyer cet email aux utilisateurs sélectionnés. Cette action est irréversible. Voulez-vous continuer ?';
            default:
                return 'Voulez-vous envoyer cet email ?';
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gt-text flex items-center gap-3">
                    <Mail className="text-gt-primary" />
                    Envoi de mails groupés
                </h1>
                <p className="text-gt-text-muted mt-1">
                    Communiquez avec les utilisateurs ou l'équipe staff
                </p>
            </div>

            {/* Stats Card - Show after successful send */}
            {stats && (
                <div className="bg-gt-surface-elevated rounded-xl border border-gt-border p-6">
                    <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gt-text flex items-center gap-2">
                            <CheckCircle2 className="text-green-500" size={20} />
                            Résultats de l'envoi
                        </h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={dismissStats}
                            className="text-gt-text-muted hover:text-gt-text"
                        >
                            <X size={16} />
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        {/* Total */}
                        <div className="bg-gt-surface p-4 rounded-lg border border-gt-border">
                            <p className="text-sm text-gt-text-muted mb-1">Total destinataires</p>
                            <p className="text-2xl font-bold text-gt-text">{stats.totalRecipients}</p>
                        </div>

                        {/* Success */}
                        <div className="bg-gt-surface p-4 rounded-lg border border-green-500/20">
                            <p className="text-sm text-gt-text-muted mb-1">Envois réussis</p>
                            <p className="text-2xl font-bold text-green-500">{stats.successCount}</p>
                        </div>

                        {/* Failures */}
                        <div className="bg-gt-surface p-4 rounded-lg border border-red-500/20">
                            <p className="text-sm text-gt-text-muted mb-1">Échecs</p>
                            <p className="text-2xl font-bold text-red-500">{stats.failureCount}</p>
                        </div>
                    </div>

                    {/* Failed emails list */}
                    {stats.failedEmails.length > 0 && (
                        <div className="mt-4 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                            <p className="text-sm font-medium text-gt-text mb-2 flex items-center gap-2">
                                <XCircle size={16} className="text-red-500" />
                                Emails en échec ({stats.failedEmails.length})
                            </p>
                            <div className="max-h-40 overflow-y-auto">
                                <ul className="text-sm text-gt-text-muted space-y-1">
                                    {stats.failedEmails.map((email, index) => (
                                        <li key={`${email}-${index}`} className="font-mono">
                                            {email}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Form */}
            <div className="bg-gt-surface-elevated rounded-xl border border-gt-border p-6">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        openConfirmModal();
                    }}
                    className="space-y-6"
                >
                    {/* Recipient Type Selector */}
                    <div className="space-y-3">
                        <Label className="text-gt-text">Destinataires</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {recipientTypes.map((type) => {
                                const Icon = type.icon;
                                const isSelected = formData.recipientType === type.value;
                                const isDisabled = type.disabled;

                                return (
                                    <button
                                        key={type.value}
                                        type="button"
                                        disabled={isDisabled || loading}
                                        onClick={() => !isDisabled && updateField('recipientType', type.value)}
                                        className={cn(
                                            'p-4 rounded-lg border-2 transition-all text-left',
                                            isDisabled
                                                ? 'opacity-50 cursor-not-allowed bg-gt-surface border-gt-border'
                                                : isSelected
                                                    ? 'border-gt-primary bg-gt-primary/10'
                                                    : 'border-gt-border bg-gt-surface hover:border-gt-border/60'
                                        )}
                                    >
                                        <div className="flex items-start gap-3">
                                            <Icon className={cn(
                                                'w-6 h-6 mt-0.5',
                                                isDisabled
                                                    ? 'text-gt-text-muted/50'
                                                    : isSelected
                                                        ? 'text-gt-primary'
                                                        : 'text-gt-text-muted'
                                            )} />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h3 className={cn(
                                                        'font-semibold',
                                                        isDisabled ? 'text-gt-text-muted/50' : 'text-gt-text'
                                                    )}>
                                                        {type.label}
                                                    </h3>
                                                    {isDisabled && (
                                                        <span className="text-xs text-gt-text-muted bg-gt-surface px-2 py-1 rounded border border-gt-border">
                                                            Bientôt
                                                        </span>
                                                    )}
                                                </div>
                                                <p className={cn(
                                                    'text-sm mt-1',
                                                    isDisabled ? 'text-gt-text-muted/50' : 'text-gt-text-muted'
                                                )}>
                                                    {type.description}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Subject Field */}
                    <div className="space-y-2">
                        <Label htmlFor="subject" className="text-gt-text">
                            Objet <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="subject"
                            type="text"
                            value={formData.subject}
                            onChange={(e) => updateField('subject', e.target.value)}
                            placeholder="Entrez le sujet de l'email"
                            maxLength={MAX_SUBJECT_LENGTH}
                            className={cn(
                                'bg-gt-surface text-gt-text border-gt-border',
                                validationErrors.subject && 'border-red-500'
                            )}
                            aria-invalid={!!validationErrors.subject}
                            disabled={loading}
                        />
                        <div className="flex items-center justify-between">
                            {validationErrors.subject && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle size={14} />
                                    {validationErrors.subject}
                                </p>
                            )}
                            <p
                                className={cn(
                                    'text-xs text-gt-text-muted ml-auto',
                                    subjectCharsRemaining < 20 && 'text-orange-500',
                                    subjectCharsRemaining === 0 && 'text-red-500'
                                )}
                            >
                                {subjectCharsRemaining} caractères restants
                            </p>
                        </div>
                    </div>

                    {/* Content Field */}
                    <div className="space-y-2">
                        <Label htmlFor="content" className="text-gt-text">
                            Contenu <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="content"
                            value={formData.content}
                            onChange={(e) => updateField('content', e.target.value)}
                            placeholder="Rédigez le contenu de votre email..."
                            maxLength={MAX_CONTENT_LENGTH}
                            rows={10}
                            className={cn(
                                'bg-gt-surface text-gt-text border-gt-border min-h-[200px] resize-y',
                                validationErrors.content && 'border-red-500'
                            )}
                            aria-invalid={!!validationErrors.content}
                            disabled={loading}
                        />
                        <div className="flex items-center justify-between">
                            {validationErrors.content && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle size={14} />
                                    {validationErrors.content}
                                </p>
                            )}
                            <p
                                className={cn(
                                    'text-xs text-gt-text-muted ml-auto',
                                    contentCharsRemaining < 500 && 'text-orange-500',
                                    contentCharsRemaining === 0 && 'text-red-500'
                                )}
                            >
                                {contentCharsRemaining} caractères restants
                            </p>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gt-border">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={resetForm}
                            disabled={loading}
                            className="border-gt-border text-gt-text"
                        >
                            <RotateCcw size={16} />
                            Réinitialiser
                        </Button>
                        <Button
                            type="submit"
                            disabled={!isFormValid || loading}
                            className="gap-2 bg-gt-primary hover:bg-gt-primary-hover text-gt-primary-foreground sm:ml-auto"
                        >
                            <Send size={16} />
                            Envoyer l'email
                        </Button>
                    </div>
                </form>
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                open={showConfirmModal}
                onOpenChange={closeConfirmModal}
                title="Confirmer l'envoi d'email"
                description={getConfirmationMessage()}
                confirmLabel="Envoyer"
                cancelLabel="Annuler"
                variant="default"
                onConfirm={sendEmail}
                loading={loading}
            />
        </div>
    );
}
