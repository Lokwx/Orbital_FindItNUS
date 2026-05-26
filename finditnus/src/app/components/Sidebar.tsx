'use client';

import { Map, SearchX, SearchCheck, Info, ChevronRight, Funnel } from 'lucide-react';

import { NotificationsNoneRounded } from '@mui/icons-material';

import { Description, Label } from '@/app/components/Catalyst/fieldset';

import { Switch, SwitchField } from '@/app/components/Catalyst/switch';

import * as Headless from '@headlessui/react';

import { useState } from 'react';

import FilterPanel from '@/app/components/FilterPanel';

export default function Sidebar() {
    const [darkMode, setDarkMode] = useState(true);
    const [filterMode, setFilterMode] = useState(false);

    const handleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const handleFilterMode = () => {
        setFilterMode(!filterMode);
    };

    return (
        <section className="flex">
            <div className="flex flex-col justify-between">
                <div className="flex flex-col mx-2 w-48 whitespace-nowrap overflow-clip">
                    <button
                        type="button"
                        className="flex flex-row items-center gap-4 px-4 py-4 rounded-2xl
                    hover:bg-indigo-500/12 hover:border-slate-200 hover:border hover:text-indigo-600"
                    >
                        <Map /> Map
                    </button>
                    <button
                        type="button" onClick={handleFilterMode}
                        className="flex flex-row items-center gap-4 px-4 py-4 rounded-2xl
                    hover:bg-indigo-500/12 hover:border-slate-200 hover:border hover:text-indigo-600"
                    >
                        <Funnel /> Filters
                    </button>
                    <button
                        type="button"
                        className="flex flex-row items-center gap-4 px-4 py-4 rounded-2xl 
                    hover:bg-indigo-500/12 hover:border-slate-200 hover:border hover:text-indigo-600"
                    >
                        <SearchX /> Lost Items
                    </button>
                    <button
                        type="button"
                        className="flex flex-row items-center gap-4 px-4 py-4 rounded-2xl 
                    hover:bg-indigo-500/12 hover:border-slate-200 hover:border hover:text-indigo-600"
                    >
                        <SearchCheck /> My Listings
                    </button>
                    <button
                        type="button"
                        className="relative flex flex-row items-center gap-4 px-4 py-4 rounded-2xl 
                    hover:bg-indigo-500/12 hover:border-slate-200 hover:border hover:text-indigo-600"
                    >
                        <NotificationsNoneRounded /> My Listings
                        <div className="absolute top-3 left-8 w-2 h-2 bg-orange-600 rounded-full flex items-center justify-center"></div>
                    </button>
                    <button
                        type="button"
                        className="flex flex-row items-center gap-4 px-4 py-4 rounded-2xl 
                    hover:bg-indigo-500/12 hover:border-slate-200 hover:border hover:text-indigo-600"
                    >
                        <Info /> About
                    </button>
                </div>
                <div className="flex mx-2 flex-col">
                    <div
                        className="flex w-full gap-4 px-2 py-4 rounded-2xl items-center
                    hover:bg-indigo-500/12 hover:border-slate-200 hover:border hover:text-indigo-600"
                    >
                        {/* #TODO Add the button to connect to the profile page */}
                        <button
                            className="flex flex-row items-center"
                            type="button"
                        >
                            <Headless.Field className="size-10 rounded-full bg-indigo-400/10 flex items-center justify-center">
                                <h1 className="font-bold text-indigo-700">WX</h1>
                            </Headless.Field>
                            <div className="flex flex-col items-start justify-center px-2">
                                <h1 className="text-md">Wei Xiong</h1>
                                <p className="text-xs text-slate-600">View Profile</p>
                            </div>
                            <ChevronRight />
                        </button>
                    </div>
                    <Headless.Field className="flex w-full gap-4 px-3 py-4 rounded-2xl items-center">
                        <Switch
                            color="indigo"
                            name="darkMode"
                            checked={darkMode}
                            onChange={handleDarkMode}
                        />
                        {darkMode ? <h1>Light Mode</h1> : <h1>Dark Mode</h1>}
                    </Headless.Field>
                </div>
            </div>
        </section>
    );
}
