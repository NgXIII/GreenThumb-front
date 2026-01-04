import axios from "axios";
import {useAccountStore} from "@/app/stores/userStore.ts";

export interface UploadImageResponse {
    success: string;
    url: string;
    message: string;
}
export async function uploadForumImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const token = useAccountStore.getState().account?.token;

    if (!token) {
        throw new Error('Non authentifié');
    }

    try {
        const response = await axios.post<UploadImageResponse>(
            `${import.meta.env.VITE_API_URL}/api/messages/upload`,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                withCredentials: true,
            }
        );

        if (response.data.success === 'true') {
            return response.data.url;
        } else {
            throw new Error('Upload failed');
        }
    } catch (error: any) {
        console.error('Upload error:', error);

        if (error.response?.data?.error) {
            throw new Error(error.response.data.error);
        }

        throw new Error('Erreur lors de l\'upload de l\'image');
    }
}

export async function uploadForumImages(files: File[]): Promise<string[]> {
    const uploadPromises = files.map(file => uploadForumImage(file));

    try {
        const urls = await Promise.all(uploadPromises);
        return urls;
    } catch (error) {
        console.error('Error uploading multiple images:', error);
        throw error;
    }
}