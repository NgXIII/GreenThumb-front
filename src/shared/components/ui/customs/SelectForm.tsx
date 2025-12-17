import { useFormContext, type Path } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel } from "@/shared/components/ui/form";
import HoverInfoError from "@/shared/components/ui/customs/HoverInfoError";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";

type SelectOption = {
    value: string;
    label: string;
};

type SelectFormProps<T extends Record<string, unknown>> = {
    name: Path<T>;
    label: string;
    placeholder?: string;
    options: SelectOption[];
    helpText?: string;
};

export default function SelectForm<T extends Record<string, unknown>>({
    name,
    label,
    placeholder,
    options,
    helpText,
}: SelectFormProps<T>) {
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
                    </div>

                    {helpText && (
                        <p className="text-xs text-gt-text-muted mb-1">{helpText}</p>
                    )}

                    <FormControl>
                        <Select onValueChange={field.onChange} value={field.value as string}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                            <SelectContent>
                                {options.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormControl>
                </FormItem>
            )}
        />
    );
}
