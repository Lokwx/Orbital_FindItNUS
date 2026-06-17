'use client';

import { useState, useEffect } from 'react';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

import { Divider } from '@mui/material'

import { CalendarClock, Locate, Tag, UserRound, LayoutGrid } from 'lucide-react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTelegram
} from '@fortawesome/free-brands-svg-icons'

import Image from 'next/image';

import { getAllItemData } from '@/Firebase';

const pinIcon = L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26" fill="#ff0a0a" class="size-6">
            <path fill-rule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clip-rule="evenodd" />
            </svg>`,
    iconSize: [36, 36],
    popupAnchor: [-6, -8],
    className: '',
});

const selectedIcon = L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26" fill="#ff0a0a" class="size-6">
            <path fill-rule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clip-rule="evenodd" />
            </svg>`,
    iconSize: [36, 36],
    popupAnchor: [-6, -8],
    className: '',
});

const nonSelectedIcon = L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26" fill="none" class="size-0">
            <path fill-rule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clip-rule="evenodd" />
            </svg>`,
    iconSize: [36, 36],
    popupAnchor: [-6, -8],
    className: '',
});

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

const NUS_AREA_COORDINATES = {
    "UTown": {
        "latitude": 1.3059176154741567,
        "longitude": 103.7728946675182,
    },
    "Central Library": {
        "latitude": 1.2966294465706647,
        "longitude": 103.77299429635536,
    },
    "Engineering": {
        "latitude": 1.3003535990313602,
        "longitude": 103.77077734424164,
    },
    "Computing": {
        "latitude": 1.2949570151935264,
        "longitude": 103.77399521961179,
    },
    "Science": {
        "latitude": 1.29651282268807,
        "longitude": 103.78035618844802,
    },
    "Business": {
        "latitude": 1.293229761537869,
        "longitude": 103.77401767566921,
    },
    "Arts": {
        "latitude": 1.2948536689943728,
        "longitude": 103.77156813101674,
    },
    "Medicine": {
        "latitude": 1.2965302639504568,
        "longitude": 103.78179213868317,
    },
    "UHC": {
        "latitude": 1.299360824558925,
        "longitude": 103.77635558101099,
    },
    "USC": {
        "latitude": 1.2999118637462117,
        "longitude": 103.77551105402769,
    },
    "NUS": {
        "latitude": 1.2975810637778415,
        "longitude": 103.77788569888554,
    }
}

type NusArea = keyof typeof NUS_AREA_COORDINATES

type MapProps = {
    location: string;
    id?: string;
    latitude?: number;
    longitude?: number;
}


export default function Map({location, id, latitude, longitude}:MapProps) {
    // Initial setup of origin location
    const area = location in NUS_AREA_COORDINATES ? (location as NusArea) : "NUS";
    const originX = NUS_AREA_COORDINATES[area].latitude;
    const originY = NUS_AREA_COORDINATES[area].longitude;
    const position:[number,number] = (id != null && latitude != null && longitude != null) ? [latitude,longitude] : [originX, originY]

    const [items, setItems] = useState<Item[]>([]);

    useEffect(() => {
        const loadDatabase = async () => {
            const data: Item[] = await getAllItemData();
            setItems(data);
        };

        loadDatabase();
    }, []);

    return (
        <div className="flex h-full w-full">
            <MapContainer
                center={position}
                zoom={15}
                scrollWheelZoom={true}
                className="h-full w-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {items.map((itemData) => (
                    <Marker
                        key={itemData.id}
                        position={itemData.Latitude != undefined && itemData.Longitude != undefined ? [itemData.Latitude, itemData.Longitude] : position}
                        icon = {(id == null) ? pinIcon : (id == itemData.id) ? selectedIcon : nonSelectedIcon}
                    >
                        <Popup autoPan={true}>
                            <section className="flex flex-col h-130 w-76 font-sans">
                                <div className='flex flex-row items-center justify-between gap-4 my-2 mx-4'>
                                    <Image
                                    src="https://thesvg.org/icons/google-maps/default.svg"
                                    alt="Google Maps"
                                    width={20}
                                    height={20}
                                    />      
                                    <div className='flex w-full flex-row items-center justify-between text-start'>
                                        <div>
                                            <h1 className='text-lg font-semibold text-nowrap'>{itemData.ItemLocation}</h1> 
                                            <h2 className='text-sm text-slate-400'>{itemData.ItemLocationDetail}</h2>
                                        </div>
                                        <div className='flex w-full justify-center gap-1'>
                                            <Locate className='stroke-1 size-4'/>
                                            {itemData.Latitude?.toPrecision(4)}, {itemData.Longitude?.toPrecision(4)}
                                        </div>
                                    </div> 
                                </div>
                                <Divider/> 
                                {/* Item Image */}
                                <img 
                                    src={itemData.imageUrl ?? 'https://media.istockphoto.com/id/1271880340/vector/lost-items-line-vector-icon-unidentified-items-outline-isolated-icon.jpg?s=612x612&w=0&k=20&c=d2kHGEmowThp_UrqIPfhxibstH6Sq5yDZJ41NetzVaA='}
                                    alt={itemData.ItemName ?? 'Item Image'}
                                    className='w-full h-40 object-scale-down rounded-md my-0.25'
                                >
                                </img>
                                <section className='flex items-center flex-1 w-full min-h-0'>
                                    <div className='flex flex-col items-start justify-start bg-slate-100/50 w-full h-full m-2 rounded-xl border-2 border-slate-200 shadow-md overflow-y-auto'>
                                        <div className='flex flex-row items-center mx-2 mt-1 p-1 gap-2'>
                                            <div className='bg-slate-200/60 p-2 rounded-full'><Tag className='stroke-1 size-5'/></div>
                                            <div className='flex flex-col'>
                                                <span className='text-xs'>Report Type</span>
                                                <span className='text-md font-bold'>{itemData.ReportType}</span>
                                            </div>
                                        </div>
                                        <div className='flex flex-row items-center mx-2 mt-1 p-1 gap-2'>
                                            <div className='bg-slate-200/60 p-2 rounded-full'><LayoutGrid className='stroke-1 size-5'/></div>
                                            <div className='flex flex-col'>
                                                <span className='text-xs'>Item Name</span>
                                                <span className='text-md font-bold'>{itemData.ItemName}</span>
                                            </div>
                                        </div>
                                        <div className='flex flex-row items-center mx-2 mt-1 p-1 gap-2'>
                                            <div className='bg-slate-200/60 p-2 rounded-full'><LayoutGrid className='stroke-1 size-5'/></div>
                                            <div className='flex flex-col'>
                                                <span className='text-xs'>Item Category</span>
                                                <span className='text-md font-bold'>{itemData.ItemCategory}</span>
                                            </div>
                                        </div>
                                        <div className='flex flex-row items-center mx-2 mt-1 p-1 gap-2'>
                                            <div className='bg-slate-200/60 p-2 rounded-full'><UserRound className='stroke-1 size-5'/></div>
                                            <div className='flex flex-col'>
                                                <span className='text-xs'>Submitted By</span>
                                                <span className='text-md font-bold'>@{itemData.UserName}</span>
                                            </div>
                                        </div>
                                        <div className='flex flex-row items-center mx-2 mt-1 p-1 gap-2'>
                                            <div className='bg-slate-200/60 p-2 rounded-full'><CalendarClock className='stroke-1 size-5'/></div>
                                            <div className='flex flex-col'>
                                                <span className='text-xs'>Date & Time Submitted</span>
                                                <span className='text-md font-bold'>{itemData.Day}/{itemData.Month}/{itemData.Year} {itemData.Hour}:{itemData.Minute}:{itemData.Second}</span>
                                            </div>
                                        </div>
                                        <a
                                            href={`https://t.me/${itemData.UserName}`}
                                            className='flex items-center justify-start self-stretch border-2 border-slate-200 bg-indigo-200/50 rounded-md p-2 my-1 mx-4 gap-2'
                                        >
                                            <FontAwesomeIcon icon={faTelegram} size='xl' className='text-blue-500'/> 
                                            <span className='text-black font-semibold'>Contact @{itemData.UserName}</span>
                                        </a>
                                    </div>
                                </section>
                            </section>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
