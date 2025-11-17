import { useFormContext, type Path } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import HoverInfoError from "@/shared/components/ui/customs/HoverInfoError"; // <-- ton composant

type InputFormProps<T extends Record<string, unknown>> = {
    name: Path<T>
    label: string
    placeholder?: string
    inputType?: "text" | "password" | "email" | "number" | "tel"
    autoComplete?: string
};


export default function InputForm<T extends Record<string, unknown>>(
    {name, label, placeholder, inputType = "text", autoComplete,}: InputFormProps<T>
) {
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

                    <FormControl>
                        <Input
                            {...field}
                            value={field.value as string | number | readonly string[] | undefined}
                            type={inputType}
                            placeholder={placeholder}
                            autoComplete={autoComplete}
                            className="w-full"
                        />
                    </FormControl>
                </FormItem>
            )}
        />
    );
}
