import apiClient from "@/services/http/apiClient.ts";

export async function verifyToken(token: string | undefined): Promise<boolean> {
    try {
        const response = await apiClient.get("/sessions/check",  {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.status === 200;
    } catch {
        return false;
    }
}