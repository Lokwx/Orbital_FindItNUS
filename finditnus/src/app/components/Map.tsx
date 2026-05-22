'use client'
import {MapContainer, TileLayer, useMap, Marker, Popup} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const pinIcon = L.divIcon(
    {
        html:
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red" class="size-6">
            <path fill-rule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clip-rule="evenodd" />
            </svg>`,
        iconSize: [36, 36],
        className: ""
    }
)

export default function Map() {
    const position = [1.2965, 103.7763];

    return (
        <MapContainer
            center={position}
            zoom={15}
            scrollWheelZoom={true}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
                position={position}
                icon={pinIcon}
            >
                <Popup>
                    Item XXX <br/> Contact Number
                </Popup>
            </Marker>
        </MapContainer>
    )
}





