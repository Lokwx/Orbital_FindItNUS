import Map from './components/Map';
import Topbar from './components/Topbar'
import Sidebar from './components/Sidebar';
import FilterPanel from './components/FilterPanel';
import DetailPanel from './components/DetailPanel';

export default function App() {
    return (
        <main className='h-screen w-screen bg-white'>
            <Topbar/>
        </main>
        // <Sidebar/>
        // <FilterPanel/>
        // <Map/>
        // <DetailPanel/>
    )
}
