import { Icon } from 'lucide-react';

function FormInput({
    textRows,
    inputClassName = 'text-base',
    labelContent,
    placeholder,
    icon,
    onInputSubmit,

    // React hook form
    register,
}) {
    return (
        <div className="flex flex-col">
            <label className="font-inter font-medium text-lg text-(--cinza-700)">
                {labelContent}
            </label>
            <div className={`flex justify-between border rounded-xl px-4 py-3`}>
                <textarea
                    {...register}
                    placeholder={placeholder}
                    rows={1}
                    className={`flex wrap focus:outline-0 font-inter font-medium w-full ${inputClassName}`}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
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
