import WADaily from '../assets/wadaily.png'
import ThemeButton from './ThemeButton'

export default function Footer() {
    return <footer className="flex absolute bottom-0 left-0 w-screen h-12 bg-white pl-2 justify-between items-center">
        <div className='flex items-center'>
            <img src={WADaily} alt='WADaily logo' className='h-7' />
            <p className='ml-2 text-sm'>From the WADaily Team</p>
        </div>
        <ThemeButton className={"h-full"} onClick={() => {window.location.href = 'https://wadaily.co'}}> 
            Visit
        </ThemeButton>
    </footer>
}