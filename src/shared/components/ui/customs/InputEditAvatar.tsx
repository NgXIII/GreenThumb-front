import React, { useRef, useState } from "react";
import { Camera, Trash2, User } from "lucide-react";
import { toast } from "sonner";

type props = {
    isEditMode: boolean
    onAvatarChange: (file: File | null) => void
    previewAvatar: string
    defaultAvatar: string
    onReset?: () => void
}

export default function InputEditAvatar({ isEditMode, onAvatarChange, previewAvatar }: props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDeleted, setIsDeleted] = useState(false);

    const MAX_FILE_SIZE = 2 * 1024 * 1024;

    React.useEffect(() => {
        if (!isEditMode) {
            setIsDeleted(previewAvatar === '')
        }
    }, [isEditMode, previewAvatar])

    const handleImageClick = () => {
        if (isEditMode && fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                toast.error(`L'image est trop volumineuse. Taille maximale : ${MAX_FILE_SIZE / (1024 * 1024)}MB`)
                return
            }

            if (!file.type.startsWith('image/')) {
                toast.error("Le fichier doit être une image")
                return
            }

            setIsDeleted(false)
            onAvatarChange(file)
            toast.success("Image sélectionnée avec succès")
        }
    }

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsDeleted(true)
        onAvatarChange(null)

        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }

        toast.success("Photo de profil supprimée")
    }

    return (
        <div className="relative group">
            <div
                className={`w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden ${
                    isEditMode ? 'cursor-pointer' : ''
                }`}
                onClick={isEditMode ? handleImageClick : undefined}
            >
                {isDeleted ? (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                        <User className="w-16 h-16 text-gray-500" />
                    </div>
                ) : (
                    <img
                        src={previewAvatar}
                        alt="avatar"
                        className="w-full h-full object-cover bg-white"
                        loading="lazy"
                    />
                )}
            </div>

            {isEditMode && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                    <button
                        type="button"
                        onClick={handleImageClick}
                        className="bg-gt-green hover:bg-green-700 text-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 cursor-pointer"
                        title="Changer la photo"
                    >
                        <Camera className="w-4 h-4" />
                    </button>

                    {!isDeleted && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 cursor-pointer"
                            title="Supprimer la photo"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    )
}