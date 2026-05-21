'use client'

import { useState } from 'react'
import { Map, Menu } from 'lucide-react'
import Dropdown from './Dropdown'

const navigation = [
    { name: 'Report', href: '#' },
    { name: 'Account', href: '#' },
]
export default function Navbar() {
    return (
        <header className="bg-linear-to-r from-blue-600 to-indigo-600 text-white">
            <nav className="flex items-center justify-between px-8 py-6">
                <div className="flex items-center gap-3">
                    <img
                        alt="FindItNUS logo"
                        className="size-12"
                        src="https://finditnus.web.app/logo.png"
                    />

                    <div>
                        <h1 className="text-2xl font-bold">FindItNUS</h1>
                        <p className="text-sm font-semibold text-blue-100">
                            A Unified Ecosystem for Lost and Found Items
                        </p>
                    </div>
                </div>
                <div><Dropdown/></div>
            </nav>
        </header>
    )
}