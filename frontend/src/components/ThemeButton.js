export default function ThemeButton({children, className, onClick}) {
    return <button className={`${className} bg-pink-500 text-white text-xl py-2 px-6`} onClick={onClick}>
        {children}
    </button>
}