'use client'

import { useState } from 'react'
import Image from 'next/image';

import FindItNUSHeaderWithBack from '@/app/components/Header/FindItNUSHeaderWithBack';
import { Divider } from '@mui/material';

export default function App() {
    //TODO: fix up the 'X' button and the states to see what to implement
    const [clearHistory, setClearHistory] = useState(false);
    const [clearAllHistory, setClearAllHistory] = useState(false);

    const handleClearHistory = () => {
        setClearHistory(true);
    }

    const handleResetAllHistory = () => {
        setClearAllHistory(true);
    }

    return (
        <main className="flex flex-col px-5 font-serif bg-slate-200/10 w-screen h-screen overflow-x-hidden overflow-y-auto no-scrollbar">
            <FindItNUSHeaderWithBack returnURL='/'/> 
            <h1 className='font-serif font-bold text-2xl m-2'>
                Recents
            </h1>
            <Divider/> 
            <section>
                <div className="rounded-2xl mt-2">
                    <ul className='list-none font-sans border-black shadow-md rounded-2xl'>
                        <li className='px-2 flex items-center justify-between '>
                            <div className='flex items-center gap-2 py-2'>
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
                            </div>
                            <button
                                type='button'
                                onClick={handleClearHistory}
                                className='pr-2'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </li>
                        <li className='px-2 flex items-center justify-between '>
                            <div className='flex items-center gap-2 py-2'>
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
                            </div>
                            <button
                                type='button'
                                onClick={handleClearHistory}
                                className='pr-2'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </li>
                        <li className='px-2 flex items-center justify-between '>
                            <div className='flex items-center gap-2 py-2'>
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
                            </div>
                            <button
                                type='button'
                                onClick={handleClearHistory}
                                className='pr-2'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </li>
                        <li className='px-2 flex items-center justify-between '>
                            <div className='flex items-center gap-2 py-2'>
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
                            </div>
                            <button
                                type='button'
                                onClick={handleClearHistory}
                                className='pr-2'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </li>
                        <li className='px-2 flex items-center justify-between '>
                            <div className='flex items-center gap-2 py-2'>
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
                            </div>
                            <button
                                type='button'
                                onClick={handleClearHistory}
                                className='pr-2'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </li>
                        <li className='px-2 flex items-center justify-between '>
                            <div className='flex items-center gap-2 py-2'>
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
                            </div>
                            <button
                                type='button'
                                onClick={handleClearHistory}
                                className='pr-2'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </li>
                        <li className='px-2 flex items-center justify-between '>
                            <div className='flex items-center gap-2 py-2'>
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
                            </div>
                            <button
                                type='button'
                                onClick={handleClearHistory}
                                className='pr-2'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </li>
                        <li className='px-2 flex items-center justify-between '>
                            <div className='flex items-center gap-2 py-2'>
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
                            </div>
                            <button
                                type='button'
                                onClick={handleClearHistory}
                                className='pr-2'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </li>
                        <li className='px-2 flex items-center justify-between '>
                            <div className='flex items-center gap-2 py-2'>
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
                            </div>
                            <button
                                type='button'
                                onClick={handleClearHistory}
                                className='pr-2'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </li>
                        <li className='px-2 flex items-center justify-between '>
                            <div className='flex items-center gap-2 py-2'>
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
                            </div>
                            <button
                                type='button'
                                onClick={handleClearHistory}
                                className='pr-2'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </li>
                        <li className='px-2 flex items-center justify-between '>
                            <div className='flex items-center gap-2 py-2'>
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
                            </div>
                            <button
                                type='button'
                                onClick={handleClearHistory}
                                className='pr-2'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </li>
                        <li className='px-2 flex items-center justify-between '>
                            <div className='flex items-center gap-2 py-2'>
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
                            </div>
                            <button
                                type='button'
                                onClick={handleClearHistory}
                                className='pr-2'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </li>
                    </ul>
                </div>
            </section>
            <section className='flex flex-1 items-center justify-center'>
                <button 
                    type='button'
                    onClick={handleResetAllHistory}
                    className='flex flex-1 items-center justify-center w-20 h-10 bg-orange-400/50 rounded-xl border border-orange-400/60 my-2'>
                    <h1 className='font-sans text-md text-center'>Clear All History</h1>
                </button>
            </section>
        </main>
    )
}