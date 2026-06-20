'use client'

import { ChevronLeft, Star, CalendarFold, Funnel } from 'lucide-react';

import { Divider } from '@mui/material'

import { useSearchParams } from "next/navigation";
import Link from 'next/link';

import { Suspense, useState } from 'react';
import ClientMap from '../components/Map/ClientMap';

function SavedPageContent() {
    const location = useSearchParams().get("location") ?? "NUS";
    const returnURL = useSearchParams().get("returnURL") ?? "/";
    const id = useSearchParams().get("id") ?? undefined;

    const lat = useSearchParams().get("latitude");
    const lng = useSearchParams().get("longitude");
    const latitude = lat != null ? Number(lat) : undefined;
    const longitude = lng != null ? Number(lng) : undefined;

    //Save button
    const [saved, setSaved] = useState(true)
    const handleSave = () => {
        //TODO implement storage of saved locations and update useState accordingly
        setSaved(!saved)
    }

    return (
        <main className='flex h-screen w-full max-w-[430px]'>
            <section className='flex h-screen w-full'>
                <ClientMap location={location} id={id} latitude={latitude} longitude={longitude}/>
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
