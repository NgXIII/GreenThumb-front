type InputProps = {
    label?: string
    placeholder?: string
    inputType: "text" | "password" | "email" | "file" | "number"
}

export default function Input({ label, placeholder, inputType }: InputProps) {
    return <>
        {label && <label>{label}</label>}
        <input type={inputType} placeholder={placeholder}/>
    </>
}