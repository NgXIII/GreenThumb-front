export default function TagBadge({
                      tag,
                      color = "gray"
                  }: {
    tag: string;
    color?: "gray" | "green" | "blue" | "amber" | "emerald";
}) {
    const colorClasses: Record<string, string> = {
        gray: "bg-gray-100 text-gray-700 border-gray-200",
        green: "bg-green-50 text-green-700 border-green-100",
        blue: "bg-blue-50 text-blue-700 border-blue-100",
        amber: "bg-amber-50 text-amber-700 border-amber-100",
        emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    };

    return (
        <span
            className={`inline-block text-center text-[10px] sm:text-[11px] font-medium px-2.5 py-[2px] rounded-full border ${colorClasses[color]} whitespace-nowrap`}
        >
            {tag}
        </span>
    );
}