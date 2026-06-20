'use client'

import { Tag, CalendarDays, Funnel, ChevronDown } from 'lucide-react';

import { Divider } from '@mui/material'

import { useSearchParams } from "next/navigation";
import Link from 'next/link';

import { Suspense, useState } from 'react';
import ClientMap from '../components/Map/ClientMap';
import BackChevron from '@/app/components/Navigation/BackChevron';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';


function SavedPageContent() {
    const location = useSearchParams().get("location") ?? "NUS";
    const returnURL = useSearchParams().get("returnURL") ?? "/";
    const id = useSearchParams().get("id") ?? undefined;

    const lat = useSearchParams().get("latitude");
    const lng = useSearchParams().get("longitude");
    const latitude = lat != null ? Number(lat) : undefined;
    const longitude = lng != null ? Number(lng) : undefined;

    const [filterDatePanel, setFilterDatePanel] = useState(false);

    const handleFilterDatePanel = () => {
        setFilterDatePanel(!filterDatePanel);
        setFilterCategoryPanel(false);
    }

    const [selectedDate, setSelectedDate] = useState('All Dates');
    
    const handleSelectedDate = (props:string) => {
        setSelectedDate(props);
    }

    const [filterCategoryPanel, setFilterCategoryPanel] = useState(false)

    const handleFilterCategoryPanel = () => {
        setFilterCategoryPanel(!filterCategoryPanel);
        setFilterDatePanel(false);
    }

    const [selectedCategory, setSelectedCategory] = useState('None')

    const handleSelectedCategory = (props:string) => {
        setSelectedCategory(props);
    }
    
    const [filterPanel, setFilterPanel] = useState(false);

    const handleFilterPanel = () => {
        setFilterPanel(!filterPanel);
    }


    return (
        <main className="flex relative h-screen w-full max-w-[430px] overflow-hidden">
            <header className="absolute z-10 top-4 left-3 right-3 flex items-center justify-between py-2 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center justify-start">
                    <div className="m-2">
                        <BackChevron returnURL="/" />
                    </div>
                    <div className="font-sans">
                        <h1 className="m-0.5 leading-none text-lg tracking-tight text-slate-700">Items Near</h1>
                        <h2 className="m-0.5 leading-none text-2xl font-semibold text-black tracking-tighter">{location}</h2>
                    </div>
                </div>
                {/* <div className="flex items-center justify-center mr-4">
                    {filterPanel ? (
                        <button
                            type="button"
                            onClick={handleFilterPanel}
                            className="border bg-slate-50 border-red-200 rounded-full shadow-sm p-2"
                        >
                            <Funnel className="stroke-1 text-red-500 fill-red-50" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleFilterPanel}
                            className="border bg-slate-50 border-slate-200 rounded-full shadow-sm p-2"
                        >
                            <Funnel className="stroke-1" />
                        </button>
                    )}
                </div> */}
            </header>

            {/* Filter Panel */}
            <section className="absolute z-10 top-24 left-3 right-3 flex items-center justify-center">
                <div className="grid grid-cols-2 w-full items-center justify-center text-center gap-y-1">
                    <button
                        type="button"
                        onClick={handleFilterDatePanel}
                        className="bg-slate-50 border border-slate-200 rounded-xl shadow-sm p-2 inline-flex justify-between px-4"
                    >
                        <div className="flex gap-2">
                            <CalendarDays className="stroke-2 size-5 text-sky-700" />
                            {selectedDate}
                        </div>
                        <div className="flex items-center justify-center">
                            <ChevronDown className="stroke-1 size-5 text-slate-800" />
                        </div>
                    </button>
                    <button
                        type="button"
                        onClick={handleFilterCategoryPanel}
                        className="bg-slate-50 border border-slate-200 rounded-xl shadow-sm p-2 inline-flex justify-between px-4"
                    >
                        <div className="flex gap-2">
                            <Tag className="stroke-2 size-5 text-red-500" />
                            {selectedCategory}
                        </div>
                        <div className="flex items-center justify-center">
                            <ChevronDown className="stroke-1 size-5 text-slate-800" />
                        </div>
                    </button>
                    {filterDatePanel ? (
                        <section className="bg-slate-50/90 border border-slate-200 rounded-xl flex flex-col items-start justify-center">
                            <div className='flex mx-4 text-start py-2'>
                                <FormControl>
                                <RadioGroup
                                    value={selectedDate}
                                    onChange={(event) => handleSelectedDate(event.target.value)}
                                    
                                >
                                    <FormControlLabel value="All Dates" control={<Radio color="success"/>} label="All Dates" />
                                    <FormControlLabel value="Today" control={<Radio color="success"/>} label="Today" />
                                    <FormControlLabel value="Yesterday" control={<Radio color="success"/>} label="Yesterday" />
                                    <FormControlLabel value="Last Week" control={<Radio color="success"/>} label="Last Week" />
                                </RadioGroup>
                                </FormControl>
                            </div>
                        </section>
                    ) : (
                        <div></div>
                    )}
                    {filterCategoryPanel ? (
                        <section className="bg-slate-50/90 border border-slate-200 rounded-xl flex flex-col items-start justify-center">
                            <div className='flex mx-4 text-start py-2'>
                                <FormControl>
                                <RadioGroup
                                    value={selectedCategory}
                                    onChange={(event) => handleSelectedCategory(event.target.value)}
                                >
                                    <FormControlLabel value="None" control={<Radio color="success"/>} label="None" />
                                    <FormControlLabel value="Electronics" control={<Radio color="success"/>} label="Electronics" />
                                    <FormControlLabel value="Wallets" control={<Radio color="success"/>} label="Wallets" />
                                    <FormControlLabel value="Bags" control={<Radio color="success"/>} label="Bags" />
                                    <FormControlLabel value="Keys" control={<Radio color="success"/>} label="Keys" />
                                    <FormControlLabel value="Access Cards" control={<Radio color="success"/>} label="Access Cards" />
                                    <FormControlLabel value="Bottles" control={<Radio color="success"/>} label="Bottles" />
                                    <FormControlLabel value="Umbrellas" control={<Radio color="success"/>} label="Umbrellas" />
                                    <FormControlLabel value="Others" control={<Radio color="success"/>} label="Others" />
                                </RadioGroup>
                                </FormControl>
                            </div>
                        </section>
                    ) : (
                        <div></div>
                    )}
                </div>
            </section>
            <section className="flex h-screen w-full z-0">
                <ClientMap
                    location={location}
                    id={id}
                    latitude={latitude}
                    longitude={longitude}
                    dateFilter={selectedDate}
                    categoryFilter={selectedCategory}
                />
            </section>
        </main>
    );
}

export default function Page() {
    return (
        <Suspense fallback={null}>
            <SavedPageContent />
        </Suspense>
    )
}
