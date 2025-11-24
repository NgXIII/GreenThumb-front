import React, {useRef} from "react";
import {Camera} from "lucide-react";

type props = {
    isEditMode: boolean
    onAvatarChange: (file: File) => void
    previewAvatar: string
}

export default function InputEditAvatar({ isEditMode, onAvatarChange, previewAvatar }: props) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleImageClick = () => {
        if (isEditMode && fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onAvatarChange(file);
        }
    }

    return <>
        <div className="relative">
            <img
                src={previewAvatar}
                alt="avatar"
                className={`w-32 h-32 rounded-full border-4 border-white shadow-lg bg-white ${isEditMode ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
                loading="lazy"
                onClick={handleImageClick}
            />
            {isEditMode && (
                <div
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full cursor-pointer"
                    onClick={handleImageClick}
                >
                    <Camera className="w-8 h-8 text-white"/>
                </div>
            )}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    </>
}