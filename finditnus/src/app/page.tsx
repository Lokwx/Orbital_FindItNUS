import ClientMap from './components/Map/ClientMap';
import Topbar from './components/Backup/Topbar'
import Sidebar from './components/Backup/Sidebar';

import Link from 'next/link';
import LandingPage from './components/Main Page/LandingPage'

export default function Page() {
    return (
        <main className='mx-auto flex h-screen w-full max-w-[430px] flex-col bg-white overflow-y-auto no-scrollbar'>
            <LandingPage/>
        </main>
    )
}
