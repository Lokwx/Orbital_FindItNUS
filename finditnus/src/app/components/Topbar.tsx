'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTelegram } from '@fortawesome/free-brands-svg-icons';

import { Search, NotificationsNoneRounded } from '@mui/icons-material';

import { useState } from 'react';

import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

export default function Topbar() {
    const [sidePanel, setSidePanel] = useState(false);

    const handleSidePanel = () => {
        setSidePanel(!sidePanel);
    };

    return (
        <>
            <header className="relative flex border-slate-400/50 shadow-md pb-2 rounded-2xl">
                <div className="flex flex-row items-center pt-5">
                    <button
                        type="button"
                        onClick={handleSidePanel}
                    >
                        <Menu className="pl-2 m-2" />
                    </button>
                    <div>
                        <img
                            alt="FindItNUS logo"
                            className="size-6"
                            src="https://finditnus.web.app/logo.png"
                        />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="font-bold text-md ">FindItNUS</h1>
                        <p className="text-xs text-slate-500">NUS Lost & Found</p>
                    </div>

                    <div className="px-6">
                        <button
                            type="submit"
                            className="rounded-2xl bg-linear-to-r from-indigo-600 to-blue-600 flex items-center text-white z-10 h-10 px-4 text-sm gap-2 whitespace-nowrap"
                        >
                            <FontAwesomeIcon
                                icon={faTelegram}
                                size="xl"
                            />
                            FindItNUS Telegram Bot
                        </button>
                    </div>
                </div>
                <button
                    type="button"
                    className="absolute top-22.5 right-12 z-20"
                >
                    <Search />
                </button>
                <div className="absolute top-21 left-10 z-10">
                    <input
                        type="text"
                        placeholder="Search for items"
                        className="p-2 w-88 rounded-2xl bg-white/50 border border-black placeholder:text-slate-500"
                    ></input>
                </div>
            </header>
            <section>
                {sidePanel && <Sidebar/>}
            </section>
        </>

        /*
        <header className="flex items-center gap-2 p-3 border-slate-400/50 shadow-md z-20">
            <div className="gap-3 flex flex-row items-center px-2">
                <div className="w-10 h-10 rounded-2xl bg-orange-200 items-center flex justify-center">
                    <img
                        alt="FindItNUS logo"
                        className="size-8"
                        src="https://finditnus.web.app/logo.png"
                    />
                </div>
                <div className="flex flex-col">
                    <h1 className="font-bold text-xl ">FindItNUS</h1>
                    <p className="text-sm text-slate-500">NUS Lost & Found</p>
                </div>
            </div>
            <div className="relative flex flex-1">
                <div className="absolute left-2 top-1/2 -translate-y-1/2">
                    <Search />
                </div>
                <input
                    type="text"
                    placeholder="Search for items"
                    className="flex-1 p-2 rounded-2xl border border-black pl-10 placeholder:text-transparent sm:placeholder:text-slate-500"
                ></input>

            </div>
            <div className="relative w-10 h-10 rounded-2xl bg-slate-100/10 flex items-center z-10 justify-center">
                <NotificationsNoneRounded/>
                <div className="absolute top-2 right-1.5 w-2 h-2 bg-orange-600 rounded-full flex items-center justify-center"></div>
            </div>
            <button type='submit' className="rounded-2xl bg-linear-to-r from-indigo-600 to-blue-600 flex items-center text-white z-10 h-10 px-4 text-sm gap-2 whitespace-nowrap">
                <FontAwesomeIcon icon={faTelegram} size='xl'/>
                FindItNUS Telegram Bot
            </button>
        </header>
        */
    );
}
