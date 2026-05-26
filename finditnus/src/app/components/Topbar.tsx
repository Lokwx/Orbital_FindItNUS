'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTelegram
} from '@fortawesome/free-brands-svg-icons'

import { 
    Search, 
    NotificationsNoneRounded, 
    } from '@mui/icons-material';


import {
    useState
} from 'react';

export default function Topbar() {

    return (
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
            <div className="relative w-10 h-10 rounded-2xl bg-slate-200 flex items-center z-10 justify-center">
                <NotificationsNoneRounded/>
                <div className="absolute top-2 right-1.5 w-2 h-2 bg-orange-600 rounded-full flex items-center justify-center"></div>
            </div>
            <button type='submit' className="rounded-2xl bg-linear-to-r from-indigo-600 to-blue-600 flex items-center text-white z-10 h-10 px-4 text-sm gap-2 whitespace-nowrap">
                <FontAwesomeIcon icon={faTelegram} size='xl'/>
                FindItNUS Telegram Bot
            </button>
        </header>
    );
}