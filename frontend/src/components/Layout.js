export default function Layout({children, className = '', style = {}}) {
    return <div className={`${className} w-screen h-screen flex flex-col text-gray-600`} style={style}>
        {children}
    </div>
}