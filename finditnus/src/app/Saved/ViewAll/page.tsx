import { ChevronLeft, Search } from 'lucide-react';

import Link from 'next/link';

import FindItNUSHeaderWithBack from '@/app/components/Header/FindItNUSHeaderWithBack';
import LocationBox from '@/app/components/Boxes/LocationBox'
import { Telegram } from '@mui/icons-material';

import BotLinkButton from '@/app/components/TelegramBot/BotLinkButton'

export default function App() {
    return (
        <main className='mx-auto flex h-screen w-full max-w-[430px] flex-col bg-white overflow-hidden font-serif px-5'>
            <FindItNUSHeaderWithBack/>
            <section className='flex flex-col font-bold text-2xl m-4'>
                <div className='flex flex-col'>
                    <h1>Your Saved Locations</h1>
                    <h2 className='font-serif text-sm text-slate-500'>Find your favourite locations quickly</h2>
                </div>
                <div className='flex'>
                    <input
                    type='search'
                    placeholder='Search your saved locations'
                    className='flex flex-1 text-sm mt-4 py-4 rounded-xl border border-black pl-4'
                    >
                    </input>
                    <Search className='absolute right-12 top-42.5 text-slate-500'/>
                </div>
            </section>
            <section className='flex flex-col gap-2 px-4'>
                <LocationBox 
                    name = {"Computing"}
                    postalCode = {"123456"}
                />
                <LocationBox 
                    name = {"Business"}
                    postalCode = {"123456"}
                />
                <LocationBox 
                    name = {"Science"}
                    postalCode = {"123456"}
                />
                <LocationBox 
                    name = {"Engineering"}
                    postalCode = {"123456"}
                />
                <LocationBox 
                    name = {"Arts"}
                    postalCode = {"123456"}
                />
            </section>
            <section className='flex h-10 m-2'>
                <BotLinkButton/>
            </section>
        </main>
    )
}