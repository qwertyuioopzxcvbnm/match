export default function TextEntry({title, placeholder, name, type = "text", inlineText, icon: IconObject, content = ""}) {
    return <div className="mt-2">
        <label htmlFor={name}>{title}</label>
        <div className="rounded-xl border-2 border-gray-300 py-2 px-1 overflow-hidden focus-within:border-gray-400 transition flex">
            {IconObject ? <IconObject className="text-2xl ml-2" /> : null}
            {inlineText ? <p className="ml-2">{inlineText}</p> : null}
            <input type={type} placeholder={placeholder} className="w-full h-full mx-2 focus:outline-none" name={name} defaultValue={content} />
        </div>
    </div>
}