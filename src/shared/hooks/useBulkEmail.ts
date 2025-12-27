import { useState, useCallback } from 'react';
import { sendBulkEmail, type BulkEmailRequest, type BulkEmailResponse, type RecipientType } from '@/services/repos/adminService';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

interface BulkEmailFormData {
    subject: string;
    content: string;
    recipientType: RecipientType;
    recipientUsernames: string[];
}

interface ValidationErrors {
    subject?: string;
    content?: string;
}

interface UseBulkEmailReturn {
    formData: BulkEmailFormData;
    validationErrors: ValidationErrors;
    loading: boolean;
    showConfirmModal: boolean;
    stats: BulkEmailResponse | null;
    error: string | null;
    isFormValid: boolean;
    updateField: (field: keyof BulkEmailFormData, value: string | RecipientType) => void;
    resetForm: () => void;
    openConfirmModal: () => void;
    closeConfirmModal: () => void;
    sendEmail: () => Promise<void>;
    dismissStats: () => void;
}

const initialFormData: BulkEmailFormData = {
    subject: '',
    content: '',
    recipientType: 'ALL_USERS',
    recipientUsernames: [],
};

const validateField = (field: string, value: string): string | null => {
    switch (field) {
        case 'subject':
            if (!value.trim()) return 'Le sujet est requis';
            if (value.length > 200) return 'Le sujet ne peut dépasser 200 caractères';
            return null;
        case 'content':
            if (!value.trim()) return 'Le contenu est requis';
            if (value.length > 5000) return 'Le contenu ne peut dépasser 5000 caractères';
            return null;
        default:
            return null;
    }
};

export default function useBulkEmail(): UseBulkEmailReturn {
    const [formData, setFormData] = useState<BulkEmailFormData>(initialFormData);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [loading, setLoading] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [stats, setStats] = useState<BulkEmailResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const updateField = useCallback((field: keyof BulkEmailFormData, value: string | RecipientType) => {
        setFormData((prev) => ({ ...prev, [field]: value }));

        // Validate if it's a string field
        if (typeof value === 'string' && (field === 'subject' || field === 'content')) {
            const error = validateField(field, value);
            setValidationErrors((prev) => ({
                ...prev,
                [field]: error || undefined,
            }));
        }

        // Clear any previous error state
        setError(null);
    }, []);

    const resetForm = useCallback(() => {
        setFormData(initialFormData);
        setValidationErrors({});
        setError(null);
        setStats(null);
    }, []);

    const openConfirmModal = useCallback(() => {
        // Final validation before opening modal
        const subjectError = validateField('subject', formData.subject);
        const contentError = validateField('content', formData.content);

        if (subjectError || contentError) {
            setValidationErrors({
                subject: subjectError || undefined,
                content: contentError || undefined,
            });
            return;
        }

        setShowConfirmModal(true);
    }, [formData]);

    const closeConfirmModal = useCallback(() => {
        setShowConfirmModal(false);
    }, []);

    const sendEmail = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const requestData: BulkEmailRequest = {
                subject: formData.subject.trim(),
                content: formData.content.trim(),
                recipientType: formData.recipientType,
                recipientUsernames: formData.recipientUsernames,
            };

            const response = await sendBulkEmail(requestData);
            setStats(response);
            setShowConfirmModal(false);

            // Success toast
            if (response.failureCount === 0) {
                toast.success(`Email envoyé avec succès à ${response.successCount} utilisateur(s)`);
            } else {
                toast.warning(
                    `Email envoyé à ${response.successCount}/${response.totalRecipients}. ${response.failureCount} échec(s).`
                );
            }

            // Reset form on success
            setFormData(initialFormData);
            setValidationErrors({});
        } catch (e) {
            if (e instanceof AxiosError) {
                const message = e.response?.data?.message || "Erreur lors de l'envoi de l'email";
                setError(message);
                toast.error(message);
            }
        } finally {
            setLoading(false);
        }
    }, [formData]);

    const dismissStats = useCallback(() => {
        setStats(null);
    }, []);

    const isFormValid =
        !validationErrors.subject &&
        !validationErrors.content &&
        formData.subject.trim() !== '' &&
        formData.content.trim() !== '';

    return {
        formData,
        validationErrors,
        loading,
        showConfirmModal,
        stats,
        error,
        isFormValid,
        updateField,
        resetForm,
        openConfirmModal,
        closeConfirmModal,
        sendEmail,
        dismissStats,
    };
}
