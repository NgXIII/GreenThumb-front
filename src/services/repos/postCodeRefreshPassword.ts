import apiClient from "@/services/http/apiClient.ts";

export async function postCodeRefreshPassword(mail: string): Promise<void> {
    await apiClient.post("/users/reset_codes", { email: mail });
}