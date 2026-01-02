import { useFormContext, type Path } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel } from "@/shared/components/ui/form";
import { Switch } from "@/shared/components/ui/switch";
import HoverInfoError from "@/shared/components/ui/customs/HoverInfoError";

type SwitchFormProps<T extends Record<string, unknown>> = {
    name: Path<T>;
    label: string;
    helpText?: string;
};

export default function SwitchForm<T extends Record<string, unknown>>({
    name,
    label,
    helpText,
}: SwitchFormProps<T>) {
    const { control } = useFormContext<T>();

    return (
        <FormField
            control={control}
            name={name}
            render={({ field, fieldState }) => (
                <FormItem>
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1 min-w-0">
                            <FormLabel className="whitespace-nowrap">{label}</FormLabel>

                            <span className="inline-flex w-5 h-5 shrink-0 items-center justify-center">
                                {fieldState.error ? (
                                    <HoverInfoError message={fieldState.error.message ?? ""} />
                                ) : (
                                    <span className="w-5 h-5 invisible" />
                                )}
                            </span>
                        </div>

                        <FormControl>
                            <Switch
                                checked={field.value as boolean}
                                onCheckedChange={field.onChange}
                            />
                        </FormControl>
                    </div>

                    {helpText && (
                        <p className="text-xs text-gt-text-muted mt-1">{helpText}</p>
                    )}
                </FormItem>
            )}
        />
    );
}
