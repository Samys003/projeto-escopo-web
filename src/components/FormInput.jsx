import { Icon } from 'lucide-react';

function FormInput({
    textRows = 1,
    allowEnter = false,
    inputClassName = 'text-base',
    labelContent,
    placeholder,
    icon,
    onInputSubmit,

    error,
    // React hook form
    register,
}) {
    return (
        <div className="flex flex-col">
            <div className="flex items-center gap-2">
                <label
                    className={`font-inter font-medium text-lg text-(--cinza-700)
                    lg:text-2xl`}
                >
                    {labelContent}
                </label>
                {error && (
                    <span className="text-base items-center text-red-500 font-medium ">
                        {error}
                    </span>
                )}
            </div>
            <div className={`flex justify-between border rounded-xl px-4 py-3`}>
                <textarea
                    {...register}
                    placeholder={placeholder}
                    rows={textRows}
                    className={`focus:outline-0 font-inter font-medium w-full resize-none appreace-none ${inputClassName}`}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !allowEnter) {
                            e.preventDefault();
                            onInputSubmit?.();
                        }
                    }}
                />
                <button onClick={onInputSubmit}>{icon}</button>
            </div>
        </div>
    );
}

export default FormInput;
