'use client';

import { Map, SearchX, SearchCheck, Info, ChevronRight, Funnel, Bell } from 'lucide-react';

import { NotificationsNoneRounded } from '@mui/icons-material';

import { Switch } from '@mui/material';

import * as Headless from '@headlessui/react';

import { useState } from 'react';

import FilterPanel from '@/app/components/Backup/FilterPanel';
import SideBar from '@/app/components/Backup/Sidebar';

export default function Sidebar() {
    const [darkMode, setDarkMode] = useState(true);
    const [filterMode, setFilterMode] = useState(false);
    const [sideBar, setSideBarMode] = useState(false);

    const handleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const handleFilterMode = () => {
        setFilterMode(!filterMode);
    };

    const handleSideBarMode = () => {
        setSideBarMode(!sideBar);
    };

    return (
        <section className="fixed w-screen h-screen max-w-[430px] bg-white z-30">
            <div className="flex flex-col justify-between border border-slate-400/50 shadow-xl z-40">
                <button
                    type="button"
                    className="flex flex-row items-center gap-4 px-4 py-4 rounded-2xl z-50
                        font-semibold border border-slate-200 shadow-md"
                >
                    <Map /> Map
                </button>
                <button
                    type="button"
                    onClick={handleFilterMode}
                    className="flex flex-row items-center gap-4 px-4 py-4 rounded-2xl z-50
                        font-semibold border border-slate-200 shadow-md"
                >
                    <Funnel /> Filters
                </button>
                <button
                    type="button"
                    onClick={handleSideBarMode}
                    className="flex flex-row items-center gap-4 px-4 py-4 rounded-2xl z-50
                        font-semibold border border-slate-200 shadow-md"
                >
                    <SearchX /> Lost Items
                </button>
                <button
                    type="button"
                    onClick={handleSideBarMode}
                    className="flex flex-row items-center gap-4 px-4 py-4 rounded-2xl z-50
                        font-semibold border border-slate-200 shadow-md"
                >
                    <SearchCheck /> My Listings
                </button>
                <button
                    type="button"
                    className="flex flex-row items-center gap-4 px-4 py-4 rounded-2xl z-50
                        font-semibold border border-slate-200 shadow-md"
                >
                    <Bell /> Notifications
                </button>
                <button
                    type="button"
                    className="flex flex-row items-center gap-4 px-4 py-4 rounded-2xl z-50
                        font-semibold border border-slate-200 shadow-md"
                >
                    <Info /> About
                </button>
            </div>
            <div className="flex flex-1 justify-center items-center">
                <div className="border border-slate-400/50 shadow-xl z-40 w-40 h-20 rounded-4xl m-8 bg-slate-200/60">
                    <button
                        className="flex flex-row items-center pt-4.5 pl-1"
                        type="button"
                    >
                        <div className="size-10 rounded-full bg-indigo-400/10 flex items-center justify-center text-nowrap">
                            <h1 className="font-bold text-indigo-700">WX</h1>
                        </div>
                        <div className="flex flex-col items-start justify-center px-2">
                            <h1 className="text-md">Wei Xiong</h1>
                            <p className="text-xs text-slate-600">View Profile</p>
                        </div>
                        <ChevronRight />
                    </button>
                </div>
            </div>
        </section>
    );
}
