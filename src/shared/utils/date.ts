import {formatDistanceToNow} from "date-fns";
import {fr} from "date-fns/locale";

export function formatTimeAgo(dateInput: string): string {
    const date = new Date(dateInput);
    return formatDistanceToNow(date, { addSuffix: true, locale: fr });
}