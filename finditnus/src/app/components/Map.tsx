'use client';

import { useState, useEffect } from 'react';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

import DetailPanel from './DetailPanel';

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
    id: string;
    ItemName: string;
    Location: string;
    ContactNumber: string;
    X_Pos?: number;
    Y_Pos?: number;
};

export default function Map() {
    const originX = 1.2965;
    const originY = 103.7763;
    const position: [number, number] = [originX, originY];

    const [items, setItems] = useState<Item[]>([]);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [markerClick, setMarkerClick] = useState(false);

    useEffect(() => {
        const loadDatabase = async () => {
            const data: Item[] = await getAllItemData();
            setItems(data);
        };

        loadDatabase();
    }, []);

    const handleMarkerClick = (itemData: Item) => {
        setSelectedItem(itemData);
        setMarkerClick(true);
    };

    return (
        <div className="flex h-full w-full">
            <MapContainer
                center={position}
                zoom={15}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {items.map((itemData) => (
                    <Marker
                        key={itemData.id}
                        position={itemData.X_Pos != undefined && itemData.Y_Pos != undefined ? [itemData.X_Pos, itemData.Y_Pos] : position}
                        icon={pinIcon}
                        eventHandlers={{
                            click: () => {
                                handleMarkerClick(itemData);
                            },
                        }}
                    >
                        <Popup>
                            {itemData?.ItemName} <br />
                            {itemData?.Location} <br />
                            {itemData?.ContactNumber} <br />
                            {itemData.X_Pos != undefined && itemData.Y_Pos != undefined ? (
                                <span>
                                    [{itemData?.X_Pos}, {itemData?.Y_Pos}]
                                </span>
                            ) : (
                                <span>
                                    [{originX}, {originY}]
                                </span>
                            )}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
            <div className="flex">
                {markerClick && selectedItem && (
                    <DetailPanel
                        selectedItem={selectedItem}
                        setMarkerClick={setMarkerClick}
                    />
                )}
            </div>
        </div>
    );
}
