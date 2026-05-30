'use client';

import dynamic from 'next/dynamic';

const Map = dynamic(() => import('./Map'), {
    ssr: false,
});

type ClientMapProps = {
    location: string;
}

export default function ClientMap({location}:ClientMapProps) {
    return <Map location={location}/>;
}
