import {format, formatDistanceToNow} from "date-fns";
import {fr} from "date-fns/locale";

export function formatTimeAgo(dateInput: string): string {
    const date = new Date(dateInput);
    return formatDistanceToNow(date, { addSuffix: true, locale: fr });
}

export function formatDateFr(dateInput: string): string {
    const date = new Date(dateInput);
    return format(date, "d MMMM yyyy", {locale: fr });
}