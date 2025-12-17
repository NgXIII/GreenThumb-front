import { useState } from "react";
import * as React from "react";
import { useController, useFormContext, type Path, type FieldValues } from "react-hook-form";
import {FormLabel} from "@/shared/components/ui/form.tsx";
import HoverInfoError from "@/shared/components/ui/customs/HoverInfoError.tsx";

type InputFileProps<T extends FieldValues> = {
    label: string;
    name: Path<T>;
};

export default function InputFile<T extends FieldValues>({ label, name }: InputFileProps<T>) {
    const { control } = useFormContext<T>()
    const { field, fieldState } = useController({ name, control })
    const [previewUrl, setPreviewUrl] = useState<string | undefined>()

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setPreviewUrl(base64String);
                field.onChange(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        field.onChange('')
        setPreviewUrl(undefined)
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1 min-w-0">
                <FormLabel className={`whitespace-nowrap ${fieldState.error ? 'text-red-400' : ''}`}>{label}</FormLabel>

                <span className="inline-flex w-5 h-5 shrink-0 items-center justify-center">
                    {fieldState.error ? (
                        <HoverInfoError message={fieldState.error.message ?? ""} />
                    ) : (
                        <span className="w-5 h-5 invisible" />
                    )}
                </span>
            </div>

            <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full border border-gray-300 flex items-center justify-center overflow-hidden bg-gray-100 flex-shrink-0">
                    {previewUrl ? (
                        <img src={previewUrl} alt="selected avatar" className="w-full h-full object-cover" />
                    ) : (
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    )}
                </div>

                <div className="flex flex-col gap-2 flex-1">
                    <label className="inline-flex items-center justify-center px-4 py-2 bg-gt-primary text-gt-primary-foreground
                    rounded-md cursor-pointer hover:bg-gt-primary-hover transition-colors text-sm font-medium
                    hover:shadow-md transform duration-200 hover:scale-105">
                        Choisir une image
                        <input
                            type="file"
                            accept="image/png, image/jpeg, image/jpg"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>

                    <p className="text-xs text-gt-text-muted">PNG, JPG ou JPEG</p>
                </div>

                {previewUrl && (
                    <button
                        onClick={handleRemoveImage}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                        type="button"
                        aria-label="Supprimer l'image"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}
