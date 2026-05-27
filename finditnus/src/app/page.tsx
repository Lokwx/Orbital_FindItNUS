import ClientMap from './components/ClientMap';
import Topbar from './components/Topbar'
import Sidebar from './components/Sidebar';

export default function App() {
    return (
        <main className='flex flex-col h-screen w-screen bg-white'>
            <Topbar/>
            <section className="flex flex-1 flex-row">
                <div className='flex-1 z-0'>
                    <ClientMap/>
                </div>
            </section>
        </main>
    )
}
