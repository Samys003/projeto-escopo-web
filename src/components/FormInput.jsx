import { Icon } from "lucide-react";

function FormInput(
    {
        textRows,
        inputClassName = "text-base",
        labelContent,
        placeholder,
        icon
    }
) {
    return (
        <div className="flex flex-col">
            <label className="font-inter font-medium text-lg text-(--cinza-700)">{labelContent}</label>
            <div className= {`flex justify-between border-[1px] rounded-xl px-4 py-3 ${className}`}>
                <textarea
                    rows={1}
                    className={`flex wrap focus:outline-0 font-inter font-medium w-full ${inputClassName}`}
                    type="text"
                    placeholder={placeholder}
                />
                {icon}
            </div>
        </div>
    )
}

export default FormInput;