export type Report = {
    id: number;
    messageId: number;
    reporterUsername: string;
    reason?: string;
    status: 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED';
    createdAt: string;
    reviewedAt?: string;
    reviewedBy?: string;
}

export interface CreateReportRequest {
    messageId: number;
    reason?: string;
}