import { BadgeAlert } from "lucide-react";
import * as HoverCard from "@radix-ui/react-hover-card";

type HoverInfoProps = {
    message: string;
}

export default function HoverInfoError({ message }: HoverInfoProps) {
    return (
        <HoverCard.Root>
            <HoverCard.Trigger asChild>
                <BadgeAlert className="text-red-500 w-4 h-4 cursor-pointer" size="md" />
            </HoverCard.Trigger>

            <HoverCard.Content
                side="right"
                className="bg-red-100 border border-red-300 p-2 rounded-md text-sm text-red-700 shadow-md"
            >
                {message}
            </HoverCard.Content>
        </HoverCard.Root>
    )
}
