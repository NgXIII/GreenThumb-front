import { useFormContext, type Path } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import HoverInfoError from "@/shared/components/ui/customs/HoverInfoError";
import {Textarea} from "@/shared/components/ui/textarea.tsx";

type InputFormProps<T extends Record<string, unknown>> = {
    name: Path<T>
    label: string
    placeholder?: string
    inputType?: "text" | "password" | "email" | "number" | "tel" | "textarea"
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
                        {inputType == "textarea" ? (
                            <Textarea
                                placeholder="Parlez-nous de vous..."
                                className="min-h-[120px] resize-none"
                                value={(field.value ?? "") as string}
                                onChange={(e) => field.onChange(e.target.value)}
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                            />
                        ) : (
                            <Input
                                {...field}
                                value={field.value as string | number | readonly string[] | undefined}
                                type={inputType}
                                placeholder={placeholder}
                                autoComplete={autoComplete}
                                className="w-full"
                                onChange={(e) => {
                                    const value = inputType === "number"
                                        ? (e.target.value === "" ? "" : Number(e.target.value))
                                        : e.target.value;
                                    field.onChange(value);
                                }}
                            />
                        )}
                    </FormControl>
                </FormItem>
            )}
        />
    );
}
