'use client'
import {useState} from 'react';
import { getItemData } from "@/Firebase"

export default function Search() {
    const[userQuery, setUserQuery] = useState("");

    return (
        <div className="relative flex-1">
            <input
                type="text"
                placeholder="Search for an item"
                className="flex-1 text-black font-semibold outline-none"
                value={userQuery}
                onChange={(event) => setUserQuery(event.target.value)}
            ></input>
        </div>
    );
}
