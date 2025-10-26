import { useFormContext, type Path } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import type { UserCreationPost } from "@/shared/types/schemas/UserSchema";

type InputFormProps = {
    name: Path<UserCreationPost>
    label?: string
    placeholder?: string
    inputType?: "text" | "password" | "email" | "number"
    autoComplete?: string
};

export default function InputForm({ name, label, placeholder, inputType = "text", autoComplete }: InputFormProps) {
    const { control } = useFormContext<UserCreationPost>();

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    {label && <FormLabel>{label}</FormLabel>}
                    <FormControl>
                        <Input
                            {...field}
                            type={inputType}
                            placeholder={placeholder}
                            autoComplete={autoComplete}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
