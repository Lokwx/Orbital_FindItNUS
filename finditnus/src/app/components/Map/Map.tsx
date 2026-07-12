'use client';

import { useState, useEffect, useRef } from 'react';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

import { Divider } from '@mui/material';

import { CalendarClock, Locate, Tag, UserRound, LayoutGrid, CircleCheck, CircleX, CircleQuestionMark, Folder, CalendarClockIcon } from 'lucide-react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTelegram } from '@fortawesome/free-brands-svg-icons';

import Image from 'next/image';

import { getAllItemData } from '@/Firebase';

const latOffset = 0.006;

const pinIcon = L.divIcon({
    html: `
        <img
            src="https://upload.wikimedia.org/wikipedia/commons/d/d8/Map_Pin.svg"
            style="width:22px;height:28px;"
        />
    `,
    iconSize: [36, 36],
    popupAnchor: [-6.5, -14],
    className: '',
});

const selectedIcon = L.divIcon({
    html: `
        <img
            src="https://upload.wikimedia.org/wikipedia/commons/d/d8/Map_Pin.svg"
            style="width:36px;height:44px;"
        />
    `,
    iconSize: [36, 36],
    popupAnchor: [-6.5, -18],
    className: '',
});

const nonSelectedIcon = L.divIcon({
    html: `
        <img
            src="https://upload.wikimedia.org/wikipedia/commons/d/d8/Map_Pin.svg"
            style="width:0px;height:0px;"
        />
    `,
    iconSize: [0, 0],
    popupAnchor: [-6, -14],
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
    UTown: {
        latitude: 1.3059176154741567,
        longitude: 103.7728946675182,
    },
    'Central Library': {
        latitude: 1.2966294465706647,
        longitude: 103.77299429635536,
    },
    Engineering: {
        latitude: 1.3003535990313602,
        longitude: 103.77077734424164,
    },
    Computing: {
        latitude: 1.2949570151935264,
        longitude: 103.77399521961179,
    },
    Science: {
        latitude: 1.29651282268807,
        longitude: 103.78035618844802,
    },
    Business: {
        latitude: 1.293229761537869,
        longitude: 103.77401767566921,
    },
    Arts: {
        latitude: 1.2948536689943728,
        longitude: 103.77156813101674,
    },
    Medicine: {
        latitude: 1.2965302639504568,
        longitude: 103.78179213868317,
    },
    UHC: {
        latitude: 1.299360824558925,
        longitude: 103.77635558101099,
    },
    USC: {
        latitude: 1.2999118637462117,
        longitude: 103.77551105402769,
    },
    NUS: {
        latitude: 1.29600000000000 - latOffset,
        longitude: 103.7765569888554,
    },
};

type NusArea = keyof typeof NUS_AREA_COORDINATES;

type MapProps = {
    location: string;
    id?: string;
    latitude?: number;
    longitude?: number;
    dateFilter?: string;
    categoryFilter?: string;
    listingsPanel: boolean;
    setFilteredItems?: (items:Item[]) => void;
};

const UpdateMapPosition = ({ position }: { position: [number, number] }) => {
    const map = useMap();

    useEffect(() => {
        const updatedLat = position[0] + latOffset;
        const updatedLong = position[1];
        map.setView([updatedLat,updatedLong],16);
    }, [map, position]);

    return null;
}

const ClosePopupDuringListingsPanel = ({ listingsPanel }: { listingsPanel:boolean }) => {
    const map = useMap();

    useEffect(() => {
        if (listingsPanel) map.closePopup();
    }, [map, listingsPanel]);

    return null;
}

export default function Map({ location, id, latitude, longitude, dateFilter, categoryFilter, listingsPanel, setFilteredItems}: MapProps) {
    // Initial setup of origin location
    const area = location in NUS_AREA_COORDINATES ? (location as NusArea) : 'NUS';
    const originX = NUS_AREA_COORDINATES[area].latitude;
    const originY = NUS_AREA_COORDINATES[area].longitude;
    const position: [number, number] = id != null && latitude != null && longitude != null ? [latitude, longitude] : [originX, originY];

    const [items, setItems] = useState<Item[]>([]);

    useEffect(() => {
        const loadDatabase = async () => {
            const data: Item[] = await getAllItemData();
            setItems(data);
        };

        loadDatabase();
    }, []);

    const filteredItems = items.filter((item) => {
        const matchCategoryFilter = (categoryFilter == null || categoryFilter === 'None' || item.ItemCategory?.toLowerCase().includes(categoryFilter.toLowerCase()))
        if (matchCategoryFilter == false) return false;
        
        if (dateFilter == null || dateFilter === 'All Dates') return true;
        if (item.Year == null || item.Month == null || item.Day == null) return false;
        
        const currentDate = new Date();
        currentDate.setHours(0,0,0,0);
        const itemDate = new Date(item.Year, item.Month - 1, item.Day)

        const millisecondsPerDay = 1000 * 60 * 60 * 24;

        const diffDays = (currentDate.getTime() - itemDate.getTime())/millisecondsPerDay ;
        if (dateFilter === 'Today') return diffDays === 0;
        if (dateFilter === 'Yesterday') return diffDays === 1;
        if (dateFilter === 'Last Week') return diffDays > 7;
    })

    useEffect(() => {
        setFilteredItems?.(filteredItems);
    }, [filteredItems, setFilteredItems]);

    const [mapPosition, setMapPosition] = useState<[number, number]>(position);
    const markerRefs = useRef<Record<string, L.Marker | null>>({});

    useEffect(() => {
        if (id == null) return;

        const selectedItem = items.find((item) => item.id === id);
        const selectedLatitude = selectedItem?.Latitude ?? latitude;
        const selectedLongitude = selectedItem?.Longitude ?? longitude;

        const frameId = window.requestAnimationFrame(() => {
            if (selectedLatitude != null && selectedLongitude != null) {
                setMapPosition([selectedLatitude, selectedLongitude]);
            }

            markerRefs.current[id]?.openPopup();
        });

        return () => window.cancelAnimationFrame(frameId);
    }, [id, items, latitude, longitude]);

    return (
        <section className="relative flex h-full w-full">
            <MapContainer
                center={position}
                zoom={16}
                scrollWheelZoom={true}
                zoomControl={false}
                className="h-full w-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                <UpdateMapPosition position={mapPosition} />
                <ClosePopupDuringListingsPanel listingsPanel={listingsPanel} />

                {filteredItems.map((itemData) => {
                    const selectedMarkerPosition: [number, number] = itemData.Latitude != undefined && itemData.Longitude != undefined ? [itemData.Latitude, itemData.Longitude] : position;

                    return (
                        <Marker
                            key={itemData.id}
                            ref={(marker) => {
                                if (itemData.id != null) {
                                    markerRefs.current[itemData.id] = marker;
                                }
                            }}
                            position={selectedMarkerPosition}
                            icon={id === itemData.id ? selectedIcon : pinIcon}
                            eventHandlers={{
                                click: () => {
                                    setMapPosition(selectedMarkerPosition);
                                },
                            }}
                        >
                            <Popup autoPan={false}>
                                <section className="flex flex-col h-130 w-76 font-sans">
                                    <div className="flex w-full items-center border border-slate-200 rounded-xl px-4 py-2 shadow-sm">
                                        <div className="flex w-full min-w-0 flex-row items-center gap-4">
                                            <Image
                                                src="https://thesvg.org/icons/google-maps/default.svg"
                                                alt="Google Maps"
                                                width={20}
                                                height={20}
                                                className="shrink-0"
                                            />
                                            <div className="flex min-w-0 flex-1 flex-row items-center text-start gap-4">
                                                <div className="flex min-w-0 flex-1 flex-col">
                                                    <h1 className="truncate text-lg font-semibold">{itemData.ItemLocation}</h1>
                                                    <h2 className="truncate text-sm text-blue-600">{itemData.ItemLocationDetail}</h2>
                                                </div>
                                                <div className="mr-6 shrink-0">
                                                    {itemData.ReportType == 'found' ? (
                                                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-700">
                                                            <CircleCheck className="size-4 fill-emerald-600 text-emerald-600 stroke-white" />
                                                            <span className="text-xs font-bold tracking-wider">{itemData.ReportType?.toUpperCase()}</span>
                                                        </div>
                                                    ) : itemData.ReportType == 'lost' ? (
                                                        <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-2 text-red-700">
                                                            <CircleX className="size-4 fill-red-600 text-red-600 stroke-white" />
                                                            <span className="text-xs font-bold tracking-wider">{itemData.ReportType?.toUpperCase()}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-amber-700">
                                                            <CircleQuestionMark className="size-4 fill-amber-600 text-amber-600 stroke-white" />
                                                            <span className="text-xs font-bold tracking-wider">{itemData.ReportType?.toUpperCase()}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <span className="flex flex-col pl-4 justify-center items-start mt-2 mx-2">
                                        <h1 className="text-xl font-bold">{itemData.ItemName}</h1>
                                        <h2 className="line-clamp-2 text-slate-600">{itemData.ItemDescription}</h2>
                                    </span>
                                    <img
                                        src={itemData.imageUrl ?? 'https://media.istockphoto.com/id/1271880340/vector/lost-items-line-vector-icon-unidentified-items-outline-isolated-icon.jpg?s=612x612&w=0&k=20&c=d2kHGEmowThp_UrqIPfhxibstH6Sq5yDZJ41NetzVaA='}
                                        alt={itemData.ItemName ?? 'Item Image'}
                                        className="w-full h-40 object-scale-down rounded-md mt-2"
                                    ></img>
                                    <div className="my-2">
                                        <Divider />
                                    </div>
                                    <section className="flex items-center justify-start">
                                        <div className="rounded-full my-2 mx-4 p-1.5 bg-amber-100 border border-amber-200">
                                            <Folder className="fill-amber-200" />
                                        </div>
                                        <div>
                                            <h1 className="text-xs text-slate-500">Category</h1>
                                            <h2 className="font-semibold font-sm">{itemData.ItemCategory}</h2>
                                        </div>
                                    </section>
                                    <section className="flex items-center justify-start">
                                        <div className="rounded-full my-2 mx-4 p-1.5 bg-sky-100 border border-sky-200">
                                            <UserRound className="fill-blue-100 stroke-blue-600" />
                                        </div>
                                        <div>
                                            <h1 className="text-xs text-slate-500">Submitted By</h1>
                                            <h2 className="font-semibold font-sm">@{itemData.UserName}</h2>
                                        </div>
                                    </section>
                                    <section className="flex items-center justify-start">
                                        <div className="rounded-full my-2 mx-4 p-1.5 bg-mist-100 border border-mist-200">
                                            <CalendarClock />
                                        </div>
                                        <div>
                                            <h1 className="text-xs text-slate-500">Reported At</h1>
                                            <h2 className="font-semibold font-sm">
                                                {itemData.Day}/{itemData.Month}/{itemData.Year} {String(itemData.Hour).padStart(2, '0')}:{String(itemData.Minute).padStart(2, '0')}:{String(itemData.Second).padStart(2, '0')}
                                            </h2>
                                        </div>
                                    </section>
                                    <section>
                                        <a
                                            href={`https://t.me/${itemData.UserName}`}
                                            className="flex items-center justify-center self-stretch border-2 border-sky-200 bg-sky-100 rounded-xl shadow-md p-2 my-1 mx-4 gap-2"
                                        >
                                            <FontAwesomeIcon
                                                icon={faTelegram}
                                                size="xl"
                                                className="text-blue-500 shrink-0"
                                            />
                                            <span className="truncate text-blue-500">
                                                <span className="text-sky-900">Contact</span> @{itemData.UserName}
                                            </span>
                                        </a>
                                    </section>
                                </section>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </section>
    );
}
