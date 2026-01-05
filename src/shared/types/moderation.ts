export interface ModerationReport {
    reportId: number;
    reporter: string;
    reason: string;
    status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
    reportedAt: string;
    reviewedAt: string | null;
    reviewedBy: string | null;
}

export interface AIModerationResult {
    valid: boolean | null;
    reason: string;
    category: string;
}

export interface ModerationItem {
    messageId: number;
    threadId: number;
    threadTitle: string;
    author: string;
    text: string;
    createdAt: string;
    reportCount: number;
    aiModeration: AIModerationResult;
    reports: ModerationReport[];
}

export interface ModerationResponse {
    content: ModerationItem[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}

export interface ModerationActionRequest {
    comment?: string;
}

export interface ModerationActionResponse {
    success: boolean;
    message: string;
    messageId: number;
    action: 'APPROVED' | 'REJECTED';
    reviewedBy: string;
}

export type ModerationFilter = 'all' | 'ai_rejected' | 'pending_review';
