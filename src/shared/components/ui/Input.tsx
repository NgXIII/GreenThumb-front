type InputProps = {
    label?: string
    placeholder?: string
    inputType: "text" | "password" | "email" | "number"
}

export default function Input({ label, placeholder, inputType }: InputProps) {
    return <div className="flex flex-col">
        {label && <label className="ml-1">{label}</label>}
        <input
            type={inputType}
            placeholder={placeholder}
            className="border border-gray-300 rounded-md p-1 placeholder:text-gray-400 placeholder:opacity-70 outline-none focus:border-gt-green"
        />
    </div>
}