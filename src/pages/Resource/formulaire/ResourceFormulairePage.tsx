import React, {useEffect, useState} from "react";
import {FormProvider, useController, useForm, useFormContext} from "react-hook-form";
import {useNavigate, useParams} from "react-router-dom";
import {zodResolver} from "@hookform/resolvers/zod";
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";
import {toast} from "sonner";

import {type ResourceCreationPost, ResourceCreationSchema} from "@/shared/types/schemas/ResourceSchema";
import InputForm from "@/shared/components/ui/customs/InputForm";
import {FormControl, FormField, FormItem, FormLabel} from "@/shared/components/ui/form";
import HoverInfoError from "@/shared/components/ui/customs/HoverInfoError";
import {Textarea} from "@/shared/components/ui/textarea";
import {fileToBase64} from "@/shared/utils/FileIntoBase64.ts";
import useAddResource from "@/shared/hooks/resource/useAddResource.ts";
import {useResource} from "@/shared/hooks/resource/useResources.ts";
import usePatchResource from "@/shared/hooks/resource/usePatchResource.ts";
import resolveAvatar from "@/shared/utils/resolveAvatar.ts";

const SUMMARY_MAX_LENGTH = 255;
const CONTENT_EDITOR_HEIGHT = "600px";

export default function ResourceFormulairePage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const isEdit = !!slug;

    const { addResource, error: addError, loading: addLoading } = useAddResource();
    const { resource, loading: fetchLoading } = useResource(slug ?? "");
    const { editResource, error: updateError, loading: updateLoading} = usePatchResource();
    const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

    const loading = addLoading || updateLoading;
    const error = addError || updateError;

    const methods = useForm<ResourceCreationPost>({
        resolver: zodResolver(ResourceCreationSchema),
        mode: "all",
        defaultValues: {
            title: "",
            summary: "",
            content: "",
            picture: undefined,
        },
    });

    useEffect(() => {
        if (isEdit && resource) {
            methods.reset({
                title: resource.title,
                summary: resource.summary,
                content: resource.description,
                picture: undefined,
            });
            setExistingImageUrl(resource.pictureUrl);
        }
    }, [isEdit, methods, resource]);

    const handleSubmit = async (data: ResourceCreationPost) => {
        const resourceData = { ...data };

        if (resourceData.picture instanceof File) {
            resourceData.picture = await fileToBase64(resourceData.picture);
        }

        let success: boolean;

        if (isEdit) {
            success = await editResource(resourceData, slug!);
        } else {
            success = await addResource(resourceData);
        }


        if (success) {
            toast.success(isEdit ? "Article modifié avec succès" : "Article publié avec succès", {
                description: isEdit
                    ? "Vos modifications ont été enregistrées"
                    : "Votre article est maintenant visible par la communauté"
            });
            navigate('/ressources');
        } else if (error) {
            toast.error(isEdit ? "Erreur lors de la modification" : "Erreur lors de la publication", {
                description: error
            });
        }
    };

    const handleCancel = () => {
        navigate('/ressources');
    };

    if (isEdit && fetchLoading) {
        return (
            <main className="min-h-screen bg-gt-surface flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gt-primary mx-auto"></div>
                    <p className="text-gt-text-muted">Chargement de l'article...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gt-surface transition-colors duration-300 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <header
                    className="bg-gt-surface-elevated rounded-lg p-6 border border-gt-border opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards]"
                    style={{ animationDelay: '0.1s' }}
                >
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gt-text mb-2">
                                {isEdit ? "Modifier l'article" : "Créer un article"}
                            </h1>
                            <p className="text-gt-text-muted">
                                {isEdit
                                    ? "Modifiez les informations de votre article"
                                    : "Partagez vos connaissances avec la communauté"
                                }
                            </p>
                        </div>
                        <button
                            onClick={handleCancel}
                            className="inline-flex items-center gap-2 px-4 py-2 text-gt-text hover:bg-gt-surface rounded-lg transition-colors"
                            aria-label="Retourner à la liste des ressources"
                        >
                            <span aria-hidden="true">←</span>
                            <span>Retour</span>
                        </button>
                    </div>
                </header>

                <section
                    className="bg-gt-surface-elevated rounded-lg p-8 border border-gt-border opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards]"
                    style={{ animationDelay: '0.2s' }}
                    aria-labelledby="form-title"
                >
                    <FormProvider {...methods}>
                        <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <section className="space-y-6" aria-label="Informations générales">
                                    <InputForm<ResourceCreationPost>
                                        name="title"
                                        label="Titre"
                                        placeholder="Donnez un titre accrocheur à votre article"
                                        inputType="text"
                                    />

                                    <SummaryInput />

                                    <ResourceImageUpload existingImageUrl={existingImageUrl} />
                                </section>

                                <section className="space-y-6" aria-label="Contenu de l'article">
                                    <ContentEditor />
                                </section>
                            </div>

                            <footer className="flex gap-4 pt-4 border-t border-gt-border">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gt-primary hover:bg-gt-primary/90 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                    aria-label="Publier l'article"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" aria-hidden="true"></div>
                                            <span>{isEdit ? "Modification en cours..." : "Publication en cours..."}</span>
                                        </>
                                    ) : (
                                        <span>{isEdit ? "Enregistrer les modifications" : "Publier l'article"}</span>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-6 py-3 border border-gt-border text-gt-text hover:bg-gt-surface rounded-lg transition-colors"
                                    aria-label="Annuler la création"
                                >
                                    Annuler
                                </button>
                            </footer>
                        </form>
                    </FormProvider>
                </section>
            </div>
        </main>
    );
}

function SummaryInput() {
    const { control } = useFormContext<ResourceCreationPost>();

    return (
        <FormField
            control={control}
            name="summary"
            render={({ field, fieldState }) => {
                const currentLength = (field.value ?? "").length;
                const isOverLimit = currentLength > SUMMARY_MAX_LENGTH;

                return (
                    <FormItem>
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1 min-w-0">
                                <FormLabel className="whitespace-nowrap">Résumé</FormLabel>
                                <span className="inline-flex w-5 h-5 shrink-0 items-center justify-center">
                                    {fieldState.error ? (
                                        <HoverInfoError message={fieldState.error.message ?? ""} />
                                    ) : (
                                        <span className="w-5 h-5 invisible" aria-hidden="true" />
                                    )}
                                </span>
                            </div>
                            <span
                                className={`text-xs ${isOverLimit ? 'text-red-500' : 'text-gt-text-muted'}`}
                                aria-live="polite"
                                aria-label={`${currentLength} caractères sur ${SUMMARY_MAX_LENGTH}`}
                            >
                                {currentLength}/{SUMMARY_MAX_LENGTH}
                            </span>
                        </div>

                        <FormControl>
                            <Textarea
                                placeholder="Résumez votre article en quelques lignes"
                                className="resize-none"
                                rows={3}
                                value={field.value ?? ""}
                                onChange={(e) => {
                                    if (e.target.value.length <= SUMMARY_MAX_LENGTH) {
                                        field.onChange(e.target.value);
                                    }
                                }}
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                                maxLength={SUMMARY_MAX_LENGTH}
                                aria-describedby="summary-counter"
                            />
                        </FormControl>
                    </FormItem>
                );
            }}
        />
    );
}

function ContentEditor() {
    const { control } = useFormContext<ResourceCreationPost>();
    const [showPreview, setShowPreview] = useState(false);

    const togglePreview = () => setShowPreview(prev => !prev);

    return (
        <FormField
            control={control}
            name="content"
            render={({ field, fieldState }) => (
                <FormItem className="h-full flex flex-col">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1 min-w-0">
                            <FormLabel className="whitespace-nowrap">Contenu (Markdown)</FormLabel>
                            <span className="inline-flex w-5 h-5 shrink-0 items-center justify-center">
                                {fieldState.error ? (
                                    <HoverInfoError message={fieldState.error.message ?? ""} />
                                ) : (
                                    <span className="w-5 h-5 invisible" aria-hidden="true" />
                                )}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={togglePreview}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-gt-border text-gt-text hover:bg-gt-surface rounded-lg transition-colors"
                            aria-label={showPreview ? "Revenir à l'édition" : "Afficher l'aperçu"}
                        >
                            {showPreview ? (
                                <>
                                    <span aria-hidden="true">✏️</span>
                                    <span>Éditer</span>
                                </>
                            ) : (
                                <span>Aperçu</span>
                            )}
                        </button>
                    </div>

                    <FormControl className="flex-1">
                        {showPreview ? (
                            <article
                                className="border border-gt-border rounded-lg p-4 bg-gt-surface overflow-y-auto"
                                style={{ height: CONTENT_EDITOR_HEIGHT }}
                                aria-label="Aperçu du contenu"
                            >
                                <div className="markdown-content prose prose-sm max-w-none">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {field.value || "*Aucun contenu à prévisualiser*"}
                                    </ReactMarkdown>
                                </div>
                            </article>
                        ) : (
                            <Textarea
                                placeholder="Écrivez le contenu de votre article en Markdown...&#10;&#10;Exemples:&#10;# Titre&#10;## Sous-titre&#10;**Gras** *Italique*&#10;- Liste à puces"
                                className="resize-none font-mono text-sm"
                                style={{ height: CONTENT_EDITOR_HEIGHT }}
                                value={field.value ?? ""}
                                onChange={(e) => field.onChange(e.target.value)}
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                                aria-label="Éditeur de contenu Markdown"
                            />
                        )}
                    </FormControl>
                </FormItem>
            )}
        />
    );
}

interface ResourceImageUploadProps {
    existingImageUrl?: string | null;
}

function ResourceImageUpload({ existingImageUrl }: ResourceImageUploadProps) {
    const { control } = useFormContext<ResourceCreationPost>();
    const { field, fieldState } = useController({ name: "picture", control });
    const [previewUrl, setPreviewUrl] = useState<string | undefined>();
    const [isDragging, setIsDragging] = useState(false);
    const [hasUserRemovedImage, setHasUserRemovedImage] = useState(false);


    useEffect(() => {
        if (existingImageUrl && !previewUrl && !hasUserRemovedImage) {
            setPreviewUrl(existingImageUrl);
        }
    }, [existingImageUrl, previewUrl, hasUserRemovedImage]);

    const processFile = (file: File) => {
        if (file && file.type.startsWith('image/')) {
            field.onChange(file);
            setPreviewUrl(URL.createObjectURL(file));
            setHasUserRemovedImage(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const handleRemoveImage = () => {
        field.onChange(null);
        setPreviewUrl(undefined);
        setHasUserRemovedImage(true);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1 min-w-0">
                <FormLabel className="whitespace-nowrap">Image de l'article</FormLabel>
                <span className="inline-flex w-5 h-5 shrink-0 items-center justify-center">
                    {fieldState.error ? (
                        <HoverInfoError message={fieldState.error.message ?? ""} />
                    ) : (
                        <span className="w-5 h-5 invisible" aria-hidden="true" />
                    )}
                </span>
            </div>

            <div className="space-y-3">
                {previewUrl ? (
                    <figure className="relative w-full h-52 rounded-lg border border-gt-border overflow-hidden bg-gradient-to-br from-gt-primary/10 to-gt-primary/5">
                        <img
                            src={resolveAvatar(previewUrl)}
                            alt="Aperçu de l'image de l'article"
                            className="w-full h-full object-cover"
                        />
                        <button
                            onClick={handleRemoveImage}
                            className="absolute top-3 right-3 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors shadow-lg"
                            type="button"
                            aria-label="Supprimer l'image"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                        </button>
                    </figure>
                ) : (
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`w-full h-52 rounded-lg border-2 border-dashed transition-all duration-200 flex items-center justify-center ${
                            isDragging
                                ? 'border-gt-primary bg-gt-primary/20 scale-105'
                                : 'border-gt-border bg-gradient-to-br from-gt-primary/5 to-gt-primary/10'
                        }`}
                    >
                        <div className="text-center space-y-3 pointer-events-none">
                            <div className="text-6xl opacity-30" aria-hidden="true">
                                {isDragging ? '📥' : '🌿'}
                            </div>
                            <p className="text-gt-text-muted text-sm">
                                {isDragging
                                    ? 'Déposez votre image ici'
                                    : 'Glissez-déposez une image ou utilisez le bouton ci-dessous'}
                            </p>
                        </div>
                    </div>
                )}

                <label className="inline-flex items-center justify-center px-5 py-2.5 bg-gt-primary hover:bg-gt-primary/90 text-white font-medium rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 w-full">
                    <span className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        {previewUrl ? "Changer l'image" : "Choisir une image"}
                    </span>
                    <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={handleFileChange}
                        className="hidden"
                        aria-label="Sélectionner une image pour l'article"
                    />
                </label>

                <p className="text-xs text-gt-text-muted">PNG, JPG ou JPEG (optionnel)</p>
            </div>
        </div>
    );
}
