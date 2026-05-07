function FormInput(
    {
        className="",
        label,
        placeholder
    }
) {
    return (
        <div className="flex flex-col">
            <label>{label}</label>
            <div className="border-[1px] rounded-xl px-4 py-3 text-(--color-cinza-700)">
                <input
                    className="focus:outline-0"
                    type="text"
                    placeholder={placeholder}
                />
            </div>
        </div>
    )
}

export default FormInput;