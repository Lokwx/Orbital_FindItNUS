'use client'

import { useState, useEffect } from 'react'

import { Divider } from '@mui/material'
import { Search, Bookmark, Laptop, CircuitBoard, Atom, CircleDollarSign, History, MapPin } from 'lucide-react'

import Link from "next/link";
import Image from "next/image"

import FindItNUSHeader from '@/app/components/Header/FindItNUSHeader'
import BotLinkButton from '@/app/components/TelegramBot/BotLinkButton';
import ButtonToMap from '@/app/components/Map/ButtonToMap'

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
    const [searchInput, setSearchInput] = useState("");

    const [itemData, setItems] = useState<Item[]>([]);

    useEffect(() => {
        const loadRecentItems = async () => {
            const recentItems = await getRecentItemData(RECENT_QUERIES);
            setItems(recentItems)
        }
        loadRecentItems();
    }, []);

    const filterItems = itemData.filter((item) => {
        const search = searchInput.toLowerCase().trim();

        if (search == "") return false;

        return (
            item.ItemName?.toLowerCase().includes(search) ||
            item.ItemCategory?.toLowerCase().includes(search) ||
            item.ItemDescription?.toLowerCase().includes(search) ||
            item.ItemLocation?.toLowerCase().includes(search) ||
            item.ItemLocationDetail?.toLowerCase().includes(search)
        );
    });
  

    return (
        <main className="flex flex-col px-5 font-sans bg-slate-200/10 w-screen h-screen">
            <FindItNUSHeader/>
            <section className=''>
                <h1 className='text-3xl text-front font-serif font-bold'>Stop searching<br/>everywhere.</h1>
                <Divider className='pt-2'/>
                <h1 className='text-md py-2 text-slate-400'>See lost and found reports across NUS.</h1>
            </section>
            <section className='flex relative items-center justify-center'>
                <input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                className='flex-1 rounded-xl border shadow-sm py-2.5 pl-2 text-sm'
                placeholder='Search for recently listed items'
                >
                </input>
                <Search className='absolute right-4 top-1/2 -translate-y-1/2 size-5'/>
            </section>

            {/* Search DropDown */}
            {
                (searchInput == "" && filterItems.length == 0) ? 
                <></> 
                : 
                (filterItems.length == 0) ? 
                <section className='bg-white border border-slate-400 rounded-md'>
                    <p className='text-sm ml-2.5 py-1'>No results found for {searchInput}</p>
                </section> 
                :
                <section className='bg-white border border-slate-400 rounded-md'>
                    {filterItems.map((item) => {
                        return (
                            <div 
                                key={item.id}
                                className='flex items-center justify-between'
                            >
                                <p className='text-sm ml-2.5 py-1'>
                                    {item.ItemName}
                                </p>
                            </div>
                        );
                    })}
                </section> 
            }

            <section>
                <ButtonToMap/>
            </section>
            <Divider className='py-2'/>
            <section className='py-1 flex flex-col gap-2 justify-center'>
                <div className='flex justify-between items-center'>
                    <div className='flex'>
                        <Bookmark className='text-indigo-500'/>
                        <h1 className='pl-2 text-front font-semibold'>SAVED</h1>
                    </div>
                    <div className='font-semibold text-indigo-500 px-2 py-2'>
                        <Link
                            href='/Saved/ViewAll'
                            className='px-2 py-2'
                        >
                        VIEW ALL
                        </Link>
                    </div>
                </div>
                <div className='gap-2 flex'>
                    <Link 
                    href='/Saved?location=Computing'
                    className='flex flex-1 gap-2 px-4 py-2 border border-slate-400 bg-white rounded-2xl shadow-md'
                    >
                        <Laptop/>
                        Computing
                    </Link>
                    <Link 
                    href='/Saved?location=Business'
                    className='flex flex-1 gap-2 px-4 py-2 border border-slate-400 bg-white rounded-2xl shadow-md'
                    >
                        <CircleDollarSign/>
                        Business
                    </Link>
                </div>
               <div className='gap-2 flex'>
                    <Link 
                    href='/Saved?location=Science'
                    className='flex flex-1 gap-2 px-4 py-2 border border-slate-400 bg-white rounded-2xl shadow-md'
                    >
                        <Atom/>
                        Science
                    </Link>
                    <Link 
                    href='/Saved?location=Engineering'
                    className='flex flex-1 gap-2 px-4 py-2 border border-slate-400 bg-white rounded-2xl shadow-md'
                    >
                        <CircuitBoard/>
                        Engineering
                    </Link>
                </div>
            </section>
            <Divider className='py-2'/>
            <section className='py-4 flex flex-col gap-2 justify-center'>
                <div className='flex justify-between items-center'>
                    <div className='flex'>
                        <History className='text-indigo-500'/>
                        <h1 className='pl-2 text-front font-semibold'>RECENTS</h1>
                    </div>
                    <div className='font-semibold text-indigo-500 px-2 py-2'>
                        <Link
                            href='/Recent'
                            className='px-2 py-2'
                        >
                        VIEW ALL
                        </Link>
                    </div>
                </div>
                <div className="rounded-2xl">
                    <ul className='list-none font-sans border-black shadow-md rounded-2xl'>
                        <li className='px-2 flex items-center gap-2 py-2'>
                            <Image 
                                src="/icons/google-maps.svg"
                                alt='google maps icon'
                                width={32}
                                height={32}
                                className='size-8'    
                            >
                            </Image>
                            <span className='text-xl'>NUS Central Library<br/> 
                                <span className='text-sm text-slate-400'>119275</span>
                            </span>
                        </li>
                        <li className='px-2 flex items-center gap-2 py-2'>
                            <Image 
                                src="/icons/google-maps.svg"
                                alt='google maps icon'
                                width={32}
                                height={32}
                                className='size-8'    
                            >
                            </Image>
                            <span className='text-xl'>College of Design and Engineering<br/> 
                                <span className='text-sm text-slate-400'>117575</span>
                            </span>
                        </li>
                        <li className='px-2 flex items-center gap-2 py-2'>
                            <Image 
                                src="/icons/google-maps.svg"
                                alt='google maps icon'
                                width={32}
                                height={32}
                                className='size-8'    
                            >
                            </Image>
                            <span className='text-xl'>COM3<br/>
                                <span className='text-sm text-slate-400'>119391</span>
                            </span>
                        </li>
                    </ul>
                </div>
            </section>
            <section className='flex'>
                <BotLinkButton/>
            </section>
        </main>
    )
}