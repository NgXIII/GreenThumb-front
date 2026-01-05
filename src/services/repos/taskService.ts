import apiClient from "@/services/http/apiClient.ts";
import type {Task} from "@/shared/types/plant.ts";

export interface CompleteTaskResponse {
    message: string;
    task: Task;
}

export async function completeTask(taskId: number): Promise<CompleteTaskResponse> {
    const response = await apiClient.delete<CompleteTaskResponse>(`/tasks/${taskId}`);
    return response.data;
}

