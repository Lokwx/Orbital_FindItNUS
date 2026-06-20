'use client';

import dynamic from 'next/dynamic';

const Map = dynamic(() => import('./Map'), {
    ssr: false,
});

type ClientMapProps = {
    location: string;
    id?: string;
    latitude?: number;
    longitude?: number;
    dateFilter?: string;
    categoryFilter?: string
}

export default function ClientMap({location, id, latitude, longitude, dateFilter, categoryFilter}:ClientMapProps) {
    return <Map location={location} id={id} latitude={latitude} longitude={longitude} dateFilter={dateFilter} categoryFilter={categoryFilter}/>;
}
