'use client';

import dynamic from 'next/dynamic';

const Map = dynamic(() => import('./Map'), {
    ssr: false,
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

type ClientMapProps = {
    location: string;
    id?: string;
    latitude?: number;
    longitude?: number;
    dateFilter?: string;
    categoryFilter?: string;
    listingsPanel: boolean;
    setFilteredItems?: (items:Item[]) => void;
}

export default function ClientMap({location, id, latitude, longitude, dateFilter, categoryFilter, listingsPanel, setFilteredItems}:ClientMapProps) {
    return <Map location={location} id={id} latitude={latitude} longitude={longitude} dateFilter={dateFilter} categoryFilter={categoryFilter} listingsPanel={listingsPanel} setFilteredItems={setFilteredItems}/>;
}
