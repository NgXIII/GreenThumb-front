export default function resolveAvatar(avatar?: string) {
    if (avatar?.startsWith("http") || avatar?.startsWith("data:") || avatar?.startsWith("blob:")) return avatar

    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080"

    if (avatar?.startsWith("/")) {
        return `${BASE_URL.replace(/\/$/, "")}${avatar}`
    }

    return `${BASE_URL.replace(/\/$/, "")}/${avatar?.replace(/^\/+/, "")}`
}