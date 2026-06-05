'use client';

import { useState, useEffect } from 'react';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

import { Divider } from '@mui/material'

import { Asterisk } from 'lucide-react';

import { getAllItemData } from '@/Firebase';

const pinIcon = L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26" fill="red" class="size-6">
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
}


export default function Map({location}:MapProps) {
    const area = location in NUS_AREA_COORDINATES ? (location as NusArea) : "NUS";
    const originX = NUS_AREA_COORDINATES[area].latitude;
    const originY = NUS_AREA_COORDINATES[area].longitude;
    const position: [number, number] = [originX, originY];

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
                        icon={pinIcon}
                        
                    >
                        <Popup>
                            <section className="flex flex-col font-serif items-center">
                                <div className='flex bg-red-400/50 border border-red-400 font-semibold px-2 rounded-md '>
                                    Found
                                </div>
                                <div className='w-40 h-20 m-2'>
                                    <img src='https://www.shoshinsha-design.com/wp-content/uploads/2020/05/noimage_%E3%83%92%E3%82%9A%E3%82%AF%E3%83%88-760x460.png'>
                                    </img>
                                </div>
                                <div className='text-center'>
                                    <h1 className='whitespace-nowrap font-semibold text-lg'>{itemData.ItemName}</h1>
                                    <span>({itemData.ItemCategory})</span><br/>
                                    <span className='whitespace-normal items-center'>{itemData.ItemDescription}</span><br/><br></br>
                                </div>
                                <div className='text-center'>
                                     <span className='font-mono'>{itemData.Hour}:{itemData.Minute}:{itemData.Second}</span><br/>
                                    <span className='font-mono'>{itemData.Day}/{itemData.Month}/{itemData.Year}</span><br/>
                                    <span className='font-mono'>{itemData.ItemLocation}, {itemData.ItemLocationDetail}</span><br/>
                                    <span className='font-semibold whitespace-normal mt-2'>By: @{itemData.UserName}</span>
                                </div>
                            </section>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
