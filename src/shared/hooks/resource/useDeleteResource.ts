import {useState} from "react";
import {deleteResource} from "@/services/repos/resourcesRepo.ts";

export default function useDeleteResource() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string>("");

    const mutate = async (slug: string) => {
        setLoading(true);
        setError(null);

        try {
            const res = await deleteResource(slug);
            setResult(res);
            return res;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { mutate, error, loading, result };
}