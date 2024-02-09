import WADaily from '../assets/wadaily.png'

export default function Loader() {
    return <div className='relative'>
    <div style={{borderTopColor: 'transparent'}}
        className="w-16 h-16 border-4 border-blue-400 border-solid rounded-full animate-spin">
        </div>
        <div className='absolute top-0 left-0 h-full w-full flex items-center justify-center'>
            <img className='h-6 w-6' src={WADaily} alt='' />
        </div>
    </div>
}