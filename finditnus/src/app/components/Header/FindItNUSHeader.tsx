import { Info, User } from 'lucide-react';

import Link from 'next/link';

export default function FindItNUSHeader() {
    return (
        <header className="relative flex flex-row items-center justify-between py-5 z-10">
            <section className="relative flex flex-row items-center justify-center">
                <div className="absolute -left-1 size-10 rounded-2xl bg-orange-300/40 shadow-md z-0"></div>
                <img
                    alt="FindItNUS logo"
                    className="relative size-8"
                    src="https://finditnus.web.app/logo.png"
                />
                <h1 className="pl-4 text-xl font-bold">FinditNUS</h1>
            </section>
            <section className="relative flex flex-row items-center justify-center gap-4">
                <button
                    type="button"
                    className="absolute right-9 size-8 rounded-full bg-slate-100/10 z-0 border border-slate-200 shadow-md"
                ></button>
                <Info className="z-10" />
                <Link href='/Profile'>
                    <div className="absolute -right-1 size-8 rounded-full bg-slate-100/10 z-0 border border-slate-200 shadow-md"></div>
                    <User className="z-10" />
                </Link>
            </section>
        </header>
    );
}
