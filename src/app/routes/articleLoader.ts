import {toast} from "sonner";
import {type LoaderFunctionArgs, redirect} from "react-router-dom";
import {existsBySlug} from "@/services/repos/resourcesRepo.ts";
import {AxiosError} from "axios";

export const articleLoader = async ({params} : LoaderFunctionArgs) => {
    const { slug } = params;

    if (!slug) {
        toast.error("Slug manquant")
        return redirect('/ressources');
    }

    try {
        await existsBySlug(slug);
        return null;
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 404) {
                const message = error.response.data?.error || "Ressource introuvable";
                toast.error(message);
            } else {
                toast.error("Une erreur est survenue");
            }
        } else {
            toast.error("Erreur de connexion au serveur");
        }

        return redirect('/ressources');
    }
};