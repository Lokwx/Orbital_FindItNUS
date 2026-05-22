import NavBar from "./components/Navbar"
import Map from './components/Map'
import Listofitems from './components/ListOfItems'

export default function App() {
    return (
        <main className="flex flex-col h-screen w-screen">
            <section>
                <NavBar/>
            </section>
            <section className="h-screen w-screen z-0">
                <Map/>
            </section>
            <section className="absolute items-center left-1/16 right-1/16 bottom-5">
                <Listofitems
                    range="30m"
                />
            </section>
        </main>
    )
}