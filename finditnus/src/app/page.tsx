/* eslint-disable @next/next/no-img-element */
import NavBar from './components/Navbar';
import Map from './components/Map';
import Listofitems from './components/ListOfItems';

export default function App() {
    return (
        <main className="relative w-screen h-screen overflow-hidden">
            <section className="absolute inset-0 z-0">
                <Map />
            </section>

            <section className="absolute inset-0 z-10 flex items-start justify-center pt-4">
                <div className="relative w-9/10 h-1/20 rounded-xl border border-white/80 bg-white/80">
                    <div className="absolute inset-0 flex flex-row items-center justify-start gap-4">
                        <div className = "px-2 ">
                            <img
                                alt="FindItNUS logo"
                                src="https://finditnus.web.app/logo.png"
                                className="size-8"
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="Search for an item"
                            className="flex-1 text-black font-semibold"
                        ></input>
                        <div className = "gap-4 flex items-center justify-center px-4">
                            <button>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="size-6"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                            </button>
                            <button>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="size-6"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M3.74 20.25a.75.75 0 0 0 .75-.75V8.999h13.938l-2.47 2.47a.75.75 0 0 0 1.061 1.06l3.75-3.75a.75.75 0 0 0 0-1.06l-3.75-3.75a.75.75 0 0 0-1.06 1.06l2.47 2.47H3.738a.75.75 0 0 0-.75.75V19.5c0 .414.336.75.75.75Z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>

        // <main className="flex flex-col h-screen w-screen">
        //     <section>
        //         <NavBar/>
        //     </section>
        //     <section className="h-screen w-screen z-0">
        //         <Map/>
        //     </section>
        //     <section className="absolute items-center left-1/16 right-1/16 bottom-5">
        //         <Listofitems
        //             range = "30m"
        //         />
        //     </section>
        // </main>
    );
}
