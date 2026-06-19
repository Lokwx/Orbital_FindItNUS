'use client';

import { useState, useEffect } from 'react';

import { Divider } from '@mui/material';
import { Bookmark, Laptop, CircuitBoard, Atom, CircleDollarSign, History, MapPinCheck, MapPinX, MapPinSearch } from 'lucide-react';

import Link from 'next/link';
import Image from 'next/image';

import FindItNUSHeader from '@/app/components/Header/FindItNUSHeader';
import BotLinkButton from '@/app/components/TelegramBot/BotLinkButton';
import ButtonToMap from '@/app/components/Map/ButtonToMap';

import { getRecentItemData } from '@/Firebase';

const RECENT_QUERIES = 10;

type Item = {
    id?: string;

    UserID?: number;
    UserName?: string;

    ReportType?: string;
    ItemName?: string;
    ItemCategory?: string;
    ItemDescription?: string;

    ItemLocationInput?: string;
    ItemLocation?: string;
    Latitude?: number;
    Longitude?: number;
    ItemLocationDetail?: string;

    UserSubmitTiming?: unknown;
    Year?: number;
    Month?: number;
    Day?: number;
    Hour?: number;
    Minute?: number;
    Second?: number;

    imageUrl?: string;
    cloudinaryPublicID?: string;
    status?: string;
};

export default function LandingPage() {
    const [searchInput, setSearchInput] = useState('');

    const [itemData, setItems] = useState<Item[]>([]);

    useEffect(() => {
        const loadRecentItems = async () => {
            const recentItems = await getRecentItemData(RECENT_QUERIES);
            setItems(recentItems);
        };
        loadRecentItems();
    }, []);

    const filterItems = itemData.filter((item) => {
        const search = searchInput.toLowerCase().trim();

        if (search == '') return false;

        return item.ItemName?.toLowerCase().includes(search) || item.ItemCategory?.toLowerCase().includes(search) || item.ItemDescription?.toLowerCase().includes(search) || item.ItemLocation?.toLowerCase().includes(search) || item.ItemLocationDetail?.toLowerCase().includes(search);
    });

    return (
        <main className="flex flex-col px-5 font-sans bg-slate-200/10 w-screen h-screen">
            <FindItNUSHeader />
            <section className="">
                <h1 className="text-4xl text-front font-serif font-bold tracking-tight">
                    Stop searching
                    <br />
                    everywhere.
                </h1>
                <h1 className="text-sm text-slate-400">See lost and found reports across NUS.</h1>
            </section>
            <section className="relative z-20 w-full pt-2">
                <input
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    className="w-full rounded-xl border border-slate-400 shadow-sm py-2 pl-2 text-sm tracking-tight text-slate-900 "
                    placeholder="Search for recently listed items 🔎"
                ></input>
                {/* Search DropDown */}
                {searchInput == '' && filterItems.length == 0 ? (
                    <></>
                ) : filterItems.length == 0 ? (
                    <section className="absolute w-full z-10 mt-1 flex flex-col bg-white rounded-xl shadow-xl border border-slate-200">
                        <header className="flex items-center justify-between px-4 py-2 mb-2 rounded-sm border-b border-slate-300">
                            <h1 className="font-semibold text-sm text-gray-500 tracking-tight">SEARCH RESULTS</h1>
                            <p className="text-indigo-600">{filterItems.length}</p>
                        </header>
                        <p className="font-semibold text-sm text-gray-500 tracking-tight px-4 pt-1 pb-3 line-clamp-1">No results found for &quot;{searchInput}&quot;</p>
                    </section>
                ) : (
                    <section className="absolute w-full z-10 mt-1 flex flex-col bg-white rounded-xl shadow-xl border border-slate-200">
                        <header className="flex items-center justify-between px-4 py-2 mb-2 rounded-sm border-b border-slate-300">
                            <h1 className="font-semibold text-sm text-gray-500 tracking-tight">SEARCH RESULTS</h1>
                            <p className="text-indigo-600">{filterItems.length}</p>
                        </header>
                        {filterItems.map((itemData) => {
                            return (
                                <section
                                    key={itemData.id}
                                    className="flex w-full min-w-0 items-center"
                                >
                                    <div className="flex items-center justify-between">
                                        {itemData.ReportType == 'lost' ? (
                                            <div className="flex items-center justify-center rounded-xl bg-red-100 p-1.5 m-2 border border-red-200 shadow-md">
                                                <MapPinX className="text-red-600" />
                                            </div>
                                        ) : itemData.ReportType == 'found' ? (
                                            <div className="flex items-center justify-center rounded-xl bg-emerald-100 p-1.5 m-2 border border-emerald-200 shadow-md">
                                                <MapPinCheck className="text-emerald-600" />
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center rounded-xl bg-yellow-100 p-1.5 m-2 border border-yellow-200 shadow-md">
                                                <MapPinSearch className="text-yellow-600" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex min-w-0 flex-1 flex-col items-start justify-center mx-1 my-1">
                                        <div className="flex flex-col w-full min-w-0 justify-between items-start">
                                            <h1 className="w-full truncate font-semibold tracking-tight">
                                                {itemData.ItemName}
                                            </h1>
                                            <h2 className="w-full truncate text-[14px] text-slate-800 tracking-tight">
                                                {itemData.ItemLocation}, {itemData.ItemLocationDetail}
                                            </h2>
                                            <h3 className='w-full truncate text-[12px] text-slate-600 line-clamp-1'>
                                                {itemData.ItemDescription}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        {itemData.ReportType == 'lost' ? (
                                            <div className="flex items-center justify-center rounded-2xl bg-red-100 px-2 py-1 border border-red-200 shadow-md">
                                                <p className="text-red-600 text-[12px] font-semibold tracking-wider">LOST</p>
                                            </div>
                                        ) : itemData.ReportType == 'found' ? (
                                            <div className="flex items-center justify-center rounded-2xl bg-emerald-100 px-2 py-1 border border-emerald-200 shadow-md">
                                                <p className="text-emerald-600 text-[12px] font-semibold tracking-wider">FOUND</p>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center rounded-2xl bg-yellow-100 px-2 py-1 border border-yellow-200 shadow-md">
                                                <p className="text-yellow-600 text-[12px] font-semibold tracking-wider">FOUND</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center">
                                        <Link
                                            href={`/Saved?location=NUS&id=${itemData.id}&latitude=${itemData.Latitude}&longitude=${itemData.Longitude}`}
                                            className="px-2 py-4"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="currentColor"
                                                className="size-6"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                                                />
                                            </svg>
                                        </Link>
                                    </div>
                                </section>
                            );
                        })}
                    </section>
                )}
            </section>
            <section>
                <ButtonToMap />
            </section>
            <Divider className="py-2" />
            <section className="py-1 flex flex-col gap-2 justify-center">
                <div className="flex justify-between items-center">
                    <div className="flex">
                        <Bookmark className="text-indigo-500" />
                        <h1 className="pl-2 text-front font-semibold">SAVED</h1>
                    </div>
                    <div className="font-semibold text-indigo-500 px-2 py-2">
                        <Link
                            href="/Saved/ViewAll"
                            className="px-2 py-2"
                        >
                            VIEW ALL
                        </Link>
                    </div>
                </div>
                <div className="gap-2 flex">
                    <Link
                        href="/Saved?location=Computing"
                        className="flex flex-1 gap-2 px-4 py-2 border border-slate-400 bg-white rounded-2xl shadow-md"
                    >
                        <Laptop />
                        Computing
                    </Link>
                    <Link
                        href="/Saved?location=Business"
                        className="flex flex-1 gap-2 px-4 py-2 border border-slate-400 bg-white rounded-2xl shadow-md"
                    >
                        <CircleDollarSign />
                        Business
                    </Link>
                </div>
                <div className="gap-2 flex">
                    <Link
                        href="/Saved?location=Science"
                        className="flex flex-1 gap-2 px-4 py-2 border border-slate-400 bg-white rounded-2xl shadow-md"
                    >
                        <Atom />
                        Science
                    </Link>
                    <Link
                        href="/Saved?location=Engineering"
                        className="flex flex-1 gap-2 px-4 py-2 border border-slate-400 bg-white rounded-2xl shadow-md"
                    >
                        <CircuitBoard />
                        Engineering
                    </Link>
                </div>
            </section>
            <Divider className="py-2" />
            <section className="py-4 flex flex-col gap-2 justify-center">
                <div className="flex justify-between items-center">
                    <div className="flex">
                        <History className="text-indigo-500" />
                        <h1 className="pl-2 text-front font-semibold">RECENTS</h1>
                    </div>
                    <div className="font-semibold text-indigo-500 px-2 py-2">
                        <Link
                            href="/Recent"
                            className="px-2 py-2"
                        >
                            VIEW ALL
                        </Link>
                    </div>
                </div>
                <div className="rounded-2xl">
                    <ul className="list-none font-sans border-black shadow-md rounded-2xl">
                        <li className="px-2 flex items-center gap-2 py-2">
                            <Image
                                src="/icons/google-maps.svg"
                                alt="google maps icon"
                                width={32}
                                height={32}
                                className="size-8"
                            ></Image>
                            <span className="text-xl">
                                NUS Central Library
                                <br />
                                <span className="text-sm text-slate-400">119275</span>
                            </span>
                        </li>
                        <li className="px-2 flex items-center gap-2 py-2">
                            <Image
                                src="/icons/google-maps.svg"
                                alt="google maps icon"
                                width={32}
                                height={32}
                                className="size-8"
                            ></Image>
                            <span className="text-xl">
                                College of Design and Engineering
                                <br />
                                <span className="text-sm text-slate-400">117575</span>
                            </span>
                        </li>
                        <li className="px-2 flex items-center gap-2 py-2">
                            <Image
                                src="/icons/google-maps.svg"
                                alt="google maps icon"
                                width={32}
                                height={32}
                                className="size-8"
                            ></Image>
                            <span className="text-xl">
                                COM3
                                <br />
                                <span className="text-sm text-slate-400">119391</span>
                            </span>
                        </li>
                    </ul>
                </div>
            </section>
            <section className="flex">
                <BotLinkButton />
            </section>
        </main>
    );
}
