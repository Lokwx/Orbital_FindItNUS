'use client';

import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

type PropType = {
    returnURL: string;
};

export default function FindItNUSHeader({ returnURL }: PropType) {
    const router = useRouter();

    const handleBack = (returnURL: string) => {
        router.push(returnURL);
    };

    return (
        <button
            type="button"
            onClick={() => handleBack(returnURL)}
            className="bg-slate-50 border border-slate-200 rounded-full p-2 shadow-sm"
        >
            <ChevronLeft className='stroke-1'/>
        </button>
    );
}
