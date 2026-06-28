'use client'

import { Tag, CalendarDays, List, ChevronDown, MapPinX, MapPinCheck, MapPinSearch } from 'lucide-react';

import { Divider } from '@mui/material'

import { useSearchParams } from "next/navigation";
import Link from 'next/link';

import { Suspense, useState } from 'react';
import ClientMap from '../components/Map/ClientMap';
import BackChevron from '@/app/components/Navigation/BackChevron';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

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

function SavedPageContent() {
    const location = useSearchParams().get("location") ?? "NUS";
    const returnURL = useSearchParams().get("returnURL") ?? "/";
    const id = useSearchParams().get("id") ?? undefined;

    const lat = useSearchParams().get("latitude");
    const lng = useSearchParams().get("longitude");
    const latitude = lat != null ? Number(lat) : undefined;
    const longitude = lng != null ? Number(lng) : undefined;

    const [filterDatePanel, setFilterDatePanel] = useState(false);

    const handleFilterDatePanel = () => {
        setFilterDatePanel(!filterDatePanel);
        setFilterCategoryPanel(false);
    }

    const [selectedDate, setSelectedDate] = useState('All Dates');
    
    const handleSelectedDate = (props:string) => {
        setSelectedDate(props);
    }

    const [filterCategoryPanel, setFilterCategoryPanel] = useState(false)

    const handleFilterCategoryPanel = () => {
        setFilterCategoryPanel(!filterCategoryPanel);
        setFilterDatePanel(false);
    }

    const [selectedCategory, setSelectedCategory] = useState('None')

    const handleSelectedCategory = (props:string) => {
        setSelectedCategory(props);
    }
    
    const [listingsPanel, setListingsPanel] = useState(false);

    const handleListingsPanel = () => {
        setListingsPanel(!listingsPanel);
        
        if (listingsPanel == true) {
            setFilterCategoryPanel(false);
            setFilterDatePanel(false);
        }
    }

    const [filteredItems, setFilteredItems] = useState<Item[]>([]);

    return (
        <main className="flex relative h-screen w-full max-w-[430px] overflow-hidden">
            <header className="absolute z-20 top-4 left-3 right-3 flex items-center justify-between py-2 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center justify-start">
                    <div className="m-2">
                        <BackChevron returnURL="/" />
                    </div>
                    <div className="font-sans">
                        <h1 className="m-0.5 leading-none text-lg tracking-tight text-slate-700">Items Near</h1>
                        <h2 className="m-0.5 leading-none text-2xl font-semibold text-black tracking-tighter">{location}</h2>
                    </div>
                </div>
                {listingsPanel ? (
                    <button
                        type="button"
                        onClick={handleListingsPanel}
                        className="px-2 py-2 mr-4.5 rounded-xl inline-flex items-center justify-center bg-red-500/90 border border-red-500 shadow-sm gap-1"
                    >
                        <List className="size-4 stroke-2 text-white" />
                        <span className="text-white tracking-tight">View All Listings</span>
                    </button>
                ) : (
                                        <button
                        type="button"
                        onClick={handleListingsPanel}
                        className="px-2 py-2 mr-4.5 rounded-xl inline-flex items-center justify-center bg-slate-50 border border-slate-200 shadow-sm gap-1"
                    >
                        <List className="size-4 stroke-2 text-slate-700" />
                        <span className="text-slate-700 tracking-tight">View All Listings</span>
                    </button>
                )}

                {/* <div className="flex items-center justify-center mr-4">
                    {filterPanel ? (
                        <button
                            type="button"
                            onClick={handleFilterPanel}
                            className="border bg-slate-50 border-red-200 rounded-full shadow-sm p-2"
                        >
                            <Funnel className="stroke-1 text-red-500 fill-red-50" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleFilterPanel}
                            className="border bg-slate-50 border-slate-200 rounded-full shadow-sm p-2"
                        >
                            <Funnel className="stroke-1" />
                        </button>
                    )}
                </div> */}
            </header>

            {/* Filter Panel */}
            <section className="absolute z-20 top-24 left-3 right-3 flex items-center justify-center">
                <div className="grid grid-cols-2 w-full items-center justify-center text-center gap-y-1">
                    <button
                        type="button"
                        onClick={handleFilterDatePanel}
                        className="bg-slate-50 border border-slate-200 rounded-xl shadow-sm p-2 inline-flex justify-between px-4"
                    >
                        <div className="flex gap-2">
                            <CalendarDays className="stroke-2 size-5 text-sky-700" />
                            {selectedDate}
                        </div>
                        <div className="flex items-center justify-center">
                            <ChevronDown className="stroke-1 size-5 text-slate-800" />
                        </div>
                    </button>
                    <button
                        type="button"
                        onClick={handleFilterCategoryPanel}
                        className="bg-slate-50 border border-slate-200 rounded-xl shadow-sm p-2 inline-flex justify-between px-4"
                    >
                        <div className="flex gap-2">
                            <Tag className="stroke-2 size-5 text-red-500" />
                            {selectedCategory}
                        </div>
                        <div className="flex items-center justify-center">
                            <ChevronDown className="stroke-1 size-5 text-slate-800" />
                        </div>
                    </button>
                    {filterDatePanel ? (
                        <section className="bg-slate-50/90 border border-slate-200 rounded-xl flex flex-col items-start justify-center">
                            <div className="flex mx-4 text-start py-2">
                                <FormControl>
                                    <RadioGroup
                                        value={selectedDate}
                                        onChange={(event) => handleSelectedDate(event.target.value)}
                                    >
                                        <FormControlLabel
                                            value="All Dates"
                                            control={<Radio color="success" />}
                                            label="All Dates"
                                        />
                                        <FormControlLabel
                                            value="Today"
                                            control={<Radio color="success" />}
                                            label="Today"
                                        />
                                        <FormControlLabel
                                            value="Yesterday"
                                            control={<Radio color="success" />}
                                            label="Yesterday"
                                        />
                                        <FormControlLabel
                                            value="Last Week"
                                            control={<Radio color="success" />}
                                            label="Last Week"
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </div>
                        </section>
                    ) : (
                        <div></div>
                    )}
                    {filterCategoryPanel ? (
                        <section className="bg-slate-50/90 border border-slate-200 rounded-xl flex flex-col items-start justify-center">
                            <div className="flex mx-4 text-start py-2">
                                <FormControl>
                                    <RadioGroup
                                        value={selectedCategory}
                                        onChange={(event) => handleSelectedCategory(event.target.value)}
                                    >
                                        <FormControlLabel
                                            value="None"
                                            control={<Radio color="success" />}
                                            label="None"
                                        />
                                        <FormControlLabel
                                            value="Electronics"
                                            control={<Radio color="success" />}
                                            label="Electronics"
                                        />
                                        <FormControlLabel
                                            value="Wallets"
                                            control={<Radio color="success" />}
                                            label="Wallets"
                                        />
                                        <FormControlLabel
                                            value="Bags"
                                            control={<Radio color="success" />}
                                            label="Bags"
                                        />
                                        <FormControlLabel
                                            value="Keys"
                                            control={<Radio color="success" />}
                                            label="Keys"
                                        />
                                        <FormControlLabel
                                            value="Access Cards"
                                            control={<Radio color="success" />}
                                            label="Access Cards"
                                        />
                                        <FormControlLabel
                                            value="Bottles"
                                            control={<Radio color="success" />}
                                            label="Bottles"
                                        />
                                        <FormControlLabel
                                            value="Umbrellas"
                                            control={<Radio color="success" />}
                                            label="Umbrellas"
                                        />
                                        <FormControlLabel
                                            value="Others"
                                            control={<Radio color="success" />}
                                            label="Others"
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </div>
                        </section>
                    ) : (
                        <div></div>
                    )}
                </div>
            </section>

            {listingsPanel ? (
                <section className="absolute top-2/5 right-3 left-3 bottom-2 bg-slate-50 z-10 flex flex-col pr-2 pt-1 rounded-xl">
                    
                    <section className="absolute w-full z-10 mt-1 flex flex-col bg-slate-50 rounded-xl">
                        <header className="flex items-center justify-between px-4 py-4 rounded-sm border-b border-slate-300">
                            <span className="font-semibold text-sm leading-none text-gray-500 tracking-tight">ALL LISTINGS</span>
                            <span className="text-sm font-semibold leading-none text-indigo-600">{filteredItems.length}</span>
                        </header>
                    </section>

                    <section className="flex flex-col mt-12 pl-2 min-h-0 overflow-y-auto">
                        {filteredItems.map((itemData) => {
                            return (
                                <div
                                    key={itemData.id}
                                    className="flex items-center my-1 mx-2"
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
                                            <h1 className="w-full truncate font-sans font-semibold tracking-tight">{itemData.ItemName}</h1>
                                            <h2 className="w-full truncate text-[14px] text-slate-800 tracking-tight">
                                                {itemData.ItemLocation}, {itemData.ItemLocationDetail}
                                            </h2>
                                            <h3 className="w-full text-[14px] text-slate-600 line-clamp-2 m-0 leading-tight">💬 {itemData.ItemDescription}</h3>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        {itemData.ReportType == 'lost' ? (
                                            <div className="flex items-center justify-center rounded-2xl bg-red-100 px-2 py-1 mx-2 border border-red-200 shadow-md">
                                                <p className="text-red-600 text-[12px] font-semibold tracking-wider">LOST</p>
                                            </div>
                                        ) : itemData.ReportType == 'found' ? (
                                            <div className="flex items-center justify-center rounded-2xl bg-emerald-100 px-2 py-1 mx-2 border border-emerald-200 shadow-md">
                                                <p className="text-emerald-600 text-[12px] font-semibold tracking-wider">FOUND</p>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center rounded-2xl bg-yellow-100 px-2 py-1 mx-2 border border-yellow-200 shadow-md">
                                                <p className="text-yellow-600 text-[12px] font-semibold tracking-wider">FOUND</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </section>
                </section>
            ) : (
                <></>
            )}

            <section className="flex h-screen w-full z-0">
                <ClientMap
                    location={location}
                    id={id}
                    latitude={latitude}
                    longitude={longitude}
                    dateFilter={selectedDate}
                    categoryFilter={selectedCategory}
                    listingsPanel={listingsPanel}
                    setFilteredItems={setFilteredItems}
                />
            </section>
        </main>
    );
}

export default function Page() {
    return (
        <Suspense fallback={null}>
            <SavedPageContent />
        </Suspense>
    )
}
