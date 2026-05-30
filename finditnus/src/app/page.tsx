import ClientMap from './components/ClientMap';
import Topbar from './components/Topbar'
import Sidebar from './components/Sidebar';

import Link from 'next/link';
import LandingPage from './components/Main/LandingPage'

export default function Page() {
    return (
        <main className='mx-auto flex h-screen w-full max-w-[430px] flex-col bg-white overflow-y-auto no-scrollbar'>
            <LandingPage/>
        </main>
    )
}
