import { User } from 'lucide-react'

export default function App() {
    return (
        <main className='mx-auto flex h-screen w-full max-w-[430px] flex-col bg-white overflow-y-auto no-scrollbar'>
            <section className='flex flex-1 flex-col items-center justify-center'>
                <div className='rounded-full p-3 border border-indigo-200 bg-indigo-400/50 flex items-center justify-center shadow-2xl'>
                    <User className='size-30'/>
                </div>
                <div>
                    Unknown
                </div>
            </section>
        </main>
    )
}