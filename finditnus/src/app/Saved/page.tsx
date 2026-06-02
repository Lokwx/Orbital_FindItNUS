'use client'

import { ChevronLeft, Star, CalendarFold, Funnel } from 'lucide-react';

import { Divider } from '@mui/material'

import { useSearchParams } from "next/navigation";
import Link from 'next/link';

import { Suspense, useState } from 'react';
import ClientMap from '../components/Map/ClientMap';

function SavedPageContent() {
    const location = useSearchParams().get("location") ?? "Computing";
    const returnURL = useSearchParams().get("returnURL") ?? "/";

    // Location Filters
    const [today, setToday] = useState(false);
    const [yesterday, setYesterday] = useState(false);
    const [last7Days, setLast7Days] = useState(false);
    const [last14Days, setLast14Days] = useState(false);

    const handleSetToday = () => {
        setToday(true);
        setYesterday(false);
        setLast7Days(false);
        setLast14Days(false);
    }

    const handleSetTomorrow = () => {
        setToday(false);
        setYesterday(true);
        setLast7Days(false);
        setLast14Days(false);
    }

    const handleSet7Days = () => {
        setToday(false);
        setYesterday(false);
        setLast7Days(true);
        setLast14Days(false);
    }

    const handleSet14Days = () => {
        setToday(false);
        setYesterday(false);
        setLast7Days(false);
        setLast14Days(true);
    }

    // Item Filters
    const [CardsandIDs, setCardsandIDs] = useState(false);
    const [Electronics, setElectronics] = useState(false);
    const [Bags, setBags] = useState(false);
    const [PersonalItems, setPersonalItems] = useState(false);
    const [StudyMaterials, setStudyMaterials] = useState(false);
    const [Other, setOther] = useState(false);

    const handleCardsandIDs = () => {
        setCardsandIDs(true);
        setElectronics(false);
        setBags(false);
        setPersonalItems(false);
        setStudyMaterials(false);
        setOther(false);
    }   

    const handleElectronics = () => {
        setCardsandIDs(false);
        setElectronics(true);
        setBags(false);
        setPersonalItems(false);
        setStudyMaterials(false);
        setOther(false);
    }   

    const handleBags = () => {
        setCardsandIDs(false);
        setElectronics(false);
        setBags(true);
        setPersonalItems(false);
        setStudyMaterials(false);
        setOther(false);
    }

    const handlePersonalItems = () => {
        setCardsandIDs(false);
        setElectronics(false);
        setBags(false);
        setPersonalItems(true);
        setStudyMaterials(false);
        setOther(false);
    }

    const handleStudyMaterials = () => {
        setCardsandIDs(false);
        setElectronics(false);
        setBags(false);
        setPersonalItems(false);
        setStudyMaterials(true);
        setOther(false);
    }

    const handleOther = () => {
        setCardsandIDs(false);
        setElectronics(false);
        setBags(false);
        setPersonalItems(false);
        setStudyMaterials(false);
        setOther(true);
    }

    return (
        <main className='mx-auto flex h-screen w-full max-w-[430px] flex-col bg-white overflow-hidden font-serif px-5'>
            <header className='flex justify-between items-center py-5'>
                <section className='flex items-center gap-4'>
                    <Link
                        href={returnURL}
                        className='bg-slate-200/10 border border-slate-400 shadow-md rounded-full size-8 items-center justify-center flex'
                    >
                    <ChevronLeft/>
                    </Link>
                    <div className='flex flex-col justify-center'>
                        <h1 className='font-semibold text-sm'>ITEMS NEAR</h1>
                        <h2 className='font-semibold text-2xl'>{location}</h2>
                    </div>
                </section>
                <section>
                    <div className='flex items-center justify-center px-4 py-2 gap-2 bg-yellow-200/20 border border-slate-400 shadow-md rounded-full'>
                        <Star className='size-4 text-amber-400 fill-yellow-300'/>
                        <h1 className='font-semibold text-sm text-black'>SAVE</h1>
                    </div>
                </section>
            </header>
            <Divider/>
            <div className='flex justify-between items-center'>
                <div className='flex'>
                    <CalendarFold className='text-red-500'/>
                    <h1 className='pl-2 text-front font-semibold'>Dates</h1>
                </div>
                <button type='button' className='font-semibold text-red-500 px-2 py-2 text-xs'>
                    VIEW ALL
                </button>
            </div>
            <section className='flex items-center justify-between pt-2 pb-2 overflow-x-auto gap-2 no-scrollbar'>
                <button type='button' className='flex items-center rounded-4xl bg-slate-200/20 border border-slate-400 p-2'
                onClick={handleSetToday}
                >
                    <h1 className='whitespace-nowrap font-sans font-semibold text-sm'>Today</h1>
                </button>
                <button type='button' className='flex items-center rounded-4xl bg-slate-200/20 border border-slate-400 p-2'
                onClick={handleSetTomorrow}
                >
                    <h1 className='whitespace-nowrap font-sans font-semibold text-sm'>Tomorrow</h1>
                </button>
                <button type='button' className='flex items-center rounded-4xl bg-slate-200/20 border border-slate-400 p-2'
                onClick={handleSet7Days}
                >
                    <h1 className='whitespace-nowrap font-sans font-semibold text-sm'>Last 7 Days</h1>
                </button>
                <button type='button' className='flex items-center rounded-4xl bg-slate-200/20 border border-slate-400 p-2'
                onClick={handleSet14Days}
                >
                    <h1 className='whitespace-nowrap font-sans font-semibold text-sm'>Last 14 Days</h1>
                </button>
            </section>
            <div className='flex justify-between items-center'>
                <div className='flex'>
                    <Funnel className='text-slate-500'/>
                    <h1 className='pl-2 text-front font-semibold'>Filters</h1>
                </div>
                <button type='button' className='font-semibold text-red-500 px-2 py-2 text-xs'>
                    VIEW ALL
                </button>
            </div>
            <section className='pt-2 overflow-x-auto no-scrollbar'>
                <div className='flex w-max items-center gap-2'>
                    <button type='button' className='shrink-0 flex items-center justify-center rounded-4xl bg-slate-200/20 border border-slate-400 p-2'
                        onClick={handleCardsandIDs}
                    >
                    <span className='whitespace-nowrap text-center font-sans font-semibold text-sm'>Cards & IDs</span>
                    </button>
                    <button type='button' className='shrink-0 flex items-center justify-center rounded-4xl bg-slate-200/20 border border-slate-400 p-2'
                            onClick={handleElectronics}
                        >
                    <span className='whitespace-nowrap text-center font-sans font-semibold text-sm'>Electronics</span>
                    </button>
                    <button type='button' className='shrink-0 flex items-center justify-center rounded-4xl bg-slate-200/20 border border-slate-400 p-2'
                            onClick={handleBags}
                        >
                    <span className='whitespace-nowrap text-center font-sans font-semibold text-sm'>Bags</span>
                    </button>
                    <button type='button' className='shrink-0 flex items-center justify-center rounded-4xl bg-slate-200/20 border border-slate-400 p-2'
                        onClick={handlePersonalItems}
                    >
                    <span className='whitespace-nowrap text-center font-sans font-semibold text-sm'>Personal Items</span>
                    </button>
                    <button type='button' className='shrink-0 flex items-center justify-center rounded-4xl bg-slate-200/20 border border-slate-400 p-2'
                        onClick={handleStudyMaterials}
                        >
                    <span className='whitespace-nowrap text-center font-sans font-semibold text-sm'>Study Materials</span>
                    </button>
                    <button type='button' className='shrink-0 flex items-center justify-center rounded-4xl bg-slate-200/20 border border-slate-400 p-2'
                        onClick={handleOther}
                    >
                    <span className='whitespace-nowrap text-center font-sans font-semibold text-sm'>Bags</span>
                    </button>
                </div>
            </section>
            <section className='flex flex-1 items-center justify-center m-2'>
                <ClientMap location={location}/>
            </section>
        </main>
    )
}

export default function Page() {
    return (
        <Suspense fallback={null}>
            <SavedPageContent />
        </Suspense>
    )
}
