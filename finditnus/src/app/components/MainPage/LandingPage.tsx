'use client';

import { useState, useEffect } from 'react';

import { Divider } from '@mui/material';
import { Pill, Palette, Laptop, CircuitBoard, Atom, CircleDollarSign, History, MapPinCheck, MapPinX, MapPinSearch, MapPin, ClockFading, Clock } from 'lucide-react';

import Link from 'next/link';
import Image from 'next/image';

import FindItNUSHeader from '@/app/components/Header/FindItNUSHeader';
import BotLinkButton from '@/app/components/TelegramBot/BotLinkButton';
import ButtonToMap from '@/app/components/Map/ButtonToMap';

import { getRecentItemData } from '@/Firebase';

const RECENT_QUERIES = 50;

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

    const foundItems = itemData.filter((item) => {
        return item.ReportType?.toLowerCase().includes('found')
    })

    const LocationItems = (param: string) => {
        const search = param.toLowerCase().trim();

        return itemData.filter((item) => {
            return item.ItemLocation?.toLowerCase().includes(search);
        });
    };

    return (
        <main className="flex flex-col px-5 font-sans bg-slate-200/10 w-screen h-screen">
            <FindItNUSHeader />
            <section className="">
                <h1 className="text-4xl text-front font-serif font-bold tracking-tight">
                    Stop searching
                    <br />
                    everywhere.
                </h1>
                <h1 className="text-sm text-slate-400 pt-0.5">See lost and found reports across NUS.</h1>
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
                                    className="flex w-full min-w-0 items-center overflow-y-auto pr-1"
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
                                            <h1 className="w-full truncate font-semibold tracking-tight">{itemData.ItemName}</h1>
                                            <h2 className="w-full truncate text-[14px] text-slate-800 tracking-tight">
                                                {itemData.ItemLocation}, {itemData.ItemLocationDetail}
                                            </h2>
                                            <h3 className="w-full truncate text-[12px] text-slate-600 line-clamp-1">{itemData.ItemDescription}</h3>
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
            <Divider className="pt-2" />
            <section className="pt-1 flex flex-col gap-2 justify-center">
                <div className="flex justify-between items-center">
                    <div className="flex py-1">
                        <MapPin className="text-indigo-500" />
                        <h1 className="pl-1 text-front font-semibold tracking-tight">LOCATIONS</h1>
                    </div>
                    <div className="font-semibold text-indigo-500 px-2 py-1 tracking-tight">
                        <Link
                            href="/Saved/ViewAll"
                            className="px-2 py-2"
                        >
                            VIEW ALL
                        </Link>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <Link
                        href="/Saved?location=Computing"
                        className="flex items-center justify-between px-2 border border-slate-200 p-2 rounded-xl shadow-md"
                    >
                        <div className="flex gap-2">
                            <Laptop className="fill-slate-200 text-slate-800 shrink-0" />
                            <p className="font-semibold tracking-tight">Computing</p>
                        </div>
                        {LocationItems('Computing').length == 0 ? (
                            <div className="px-2 py-0.5 mx-1 rounded-full bg-red-100 border border-red-400 shadow-md">
                                <h1 className="text-xs text-red-800">{LocationItems('Computing').length}</h1>
                            </div>
                        ) : (
                            <div className="px-2 py-0.5 mx-1 rounded-full bg-emerald-100 border border-emerald-400 shadow-md">
                                <h1 className="text-xs text-emerald-800">{LocationItems('Computing').length}</h1>
                            </div>
                        )}
                    </Link>
                    <Link
                        href="/Saved?location=Business"
                        className="flex items-center justify-between px-2 border border-slate-200 p-2 rounded-xl shadow-md"
                    >
                        <div className="flex gap-2">
                            <CircleDollarSign className="fill-yellow-300 text-slate-800 shrink-0" />
                            <p className="font-semibold tracking-tight">Business</p>
                        </div>
                        {LocationItems('Business').length == 0 ? (
                            <div className="px-2 py-0.5 mx-1 rounded-full bg-red-100 border border-red-400 shadow-md">
                                <h1 className="text-xs text-red-800">{LocationItems('Business').length}</h1>
                            </div>
                        ) : (
                            <div className="px-2 py-0.5 mx-1 rounded-full bg-emerald-100 border border-emerald-400 shadow-md">
                                <h1 className="text-xs text-emerald-800">{LocationItems('Business').length}</h1>
                            </div>
                        )}
                    </Link>
                    <Link
                        href="/Saved?location=Science"
                        className="flex items-center justify-between px-2 border border-slate-200 p-2 rounded-xl shadow-md"
                    >
                        <div className="flex gap-2">
                            <Atom className="text-sky-600 shrink-0" />
                            <p className="font-semibold tracking-tight">Science</p>
                        </div>
                        {LocationItems('Science').length == 0 ? (
                            <div className="px-2 py-0.5 mx-1 rounded-full bg-red-100 border border-red-400 shadow-md">
                                <h1 className="text-xs text-red-800">{LocationItems('Science').length}</h1>
                            </div>
                        ) : (
                            <div className="px-2 py-0.5 mx-1 rounded-full bg-emerald-100 border border-emerald-400 shadow-md">
                                <h1 className="text-xs text-emerald-800">{LocationItems('Science').length}</h1>
                            </div>
                        )}
                    </Link>
                    <Link
                        href="/Saved?location=Engineering"
                        className="flex items-center justify-between px-2 border border-slate-200 p-2 rounded-xl shadow-md"
                    >
                        <div className="flex gap-2">
                            <CircuitBoard className="text-olive-600 fill-emerald-300 shrink-0" />
                            <p className="font-semibold tracking-tight">Engineering</p>
                        </div>
                        {LocationItems('Engineering').length == 0 ? (
                            <div className="px-2 py-0.5 mx-1 rounded-full bg-red-100 border border-red-400 shadow-md">
                                <h1 className="text-xs text-red-800">{LocationItems('Engineering').length}</h1>
                            </div>
                        ) : (
                            <div className="px-2 py-0.5 mx-1 rounded-full bg-emerald-100 border border-emerald-400 shadow-md">
                                <h1 className="text-xs text-emerald-800">{LocationItems('Engineering').length}</h1>
                            </div>
                        )}
                    </Link>
                    <Link
                        href="/Saved?location=Medicine"
                        className="flex items-center justify-between px-2 border border-slate-200 p-2 rounded-xl shadow-md"
                    >
                        <div className="flex gap-2">
                            <Pill className="text-olive-600 fill-slate-100 shrink-0" />
                            <p className="font-semibold tracking-tight">Medicine</p>
                        </div>
                        {LocationItems('Medicine').length == 0 ? (
                            <div className="px-2 py-0.5 mx-1 rounded-full bg-red-100 border border-red-400 shadow-md">
                                <h1 className="text-xs text-red-800">{LocationItems('Medicine').length}</h1>
                            </div>
                        ) : (
                            <div className="px-2 py-0.5 mx-1 rounded-full bg-emerald-100 border border-emerald-400 shadow-md">
                                <h1 className="text-xs text-emerald-800">{LocationItems('Medicine').length}</h1>
                            </div>
                        )}
                    </Link>
                    <Link
                        href="/Saved?location=Arts"
                        className="flex items-center justify-between px-2 border border-slate-200 p-2 rounded-xl shadow-md"
                    >
                        <div className="flex gap-2">
                            <Palette className="text-olive-600 fill-stone-100 shrink-0" />
                            <p className="font-semibold tracking-tight">Arts</p>
                        </div>
                        {LocationItems('Arts').length == 0 ? (
                            <div className="px-2 py-0.5 mx-1 rounded-full bg-red-100 border border-red-400 shadow-md">
                                <h1 className="text-xs text-red-800">{LocationItems('Arts').length}</h1>
                            </div>
                        ) : (
                            <div className="px-2 py-0.5 mx-1 rounded-full bg-emerald-100 border border-emerald-400 shadow-md">
                                <h1 className="text-xs text-emerald-800">{LocationItems('Arts').length}</h1>
                            </div>
                        )}
                    </Link>
                </div>
            </section>
            <Divider className="p-2" />
            <section className="flex flex-col gap-1 justify-center">
                <div className="flex justify-between items-center">
                    <div className="flex pt-2">
                        <History className="text-indigo-500" />
                        <h1 className="pl-2 text-front font-semibold tracking-tight">RECENT LISTINGS</h1>
                    </div>
                    {/* <div className="font-semibold text-indigo-500 px-2 pt-2">
                        <Link
                            href="/Recent"
                            className="px-2 tracking-tight"
                        >
                            VIEW ALL
                        </Link>
                    </div> */}
                </div>
            </section>
            <section className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm my-2">
                {foundItems.slice(0, 3).map((itemData) => {
                    return (
                        <div
                            key={itemData.id}
                            className="flex w-full min-w-0 items-center overflow-y-auto pr-1"
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
                                    <h1 className="w-full truncate font-semibold tracking-tight">{itemData.ItemName}</h1>
                                    <h2 className="w-full truncate text-[14px] text-slate-800 tracking-tight">
                                        {itemData.ItemLocation}, {itemData.ItemLocationDetail}
                                    </h2>
                                    <h3 className="w-full truncate text-[12px] text-slate-600 line-clamp-1">{itemData.ItemDescription}</h3>
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                {itemData.Hour == 1 ? (
                                    <div className="flex items-center justify-center gap-1">
                                        <ClockFading className="size-4 stroke-1" />
                                        <span className="text-[12px] text-slate-600">{itemData.Hour} hour ago</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-1">
                                        <ClockFading className="size-4 stroke-1" />
                                        <span className="text-[12px] text-slate-600">{itemData.Hour} hours ago</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center">
                                <Link
                                    href={`/Saved?location=NUS&id=${itemData.id}&latitude=${itemData.Latitude}&longitude=${itemData.Longitude}`}
                                    className="pr-2 pl-1 py-4"
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
                        </div>
                    );
                })}
            </section>
            <Divider/>
            <section className="flex py-2">
                <BotLinkButton />
            </section>
        </main>
    );
}
