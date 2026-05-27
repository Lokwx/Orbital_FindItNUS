import { useState } from 'react';
import { X, Tags, MapPin, FileText, UserRound } from 'lucide-react';
import { Divider } from '@mui/material'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTelegram
} from '@fortawesome/free-brands-svg-icons'

type DetailPanelProps = {
    setMarkerClick: (value: boolean) => void;
    selectedItem: {
    ItemName?: string;
    Category?: string;
    Location?: string;
    Description?: string;
    Contact?: string;
    ContactNumber?: string;
    };
};


export default function DetailPanel({ setMarkerClick, selectedItem } : DetailPanelProps) {
    const [timing, setTiming] = useState(2);
    const itemName = selectedItem.ItemName ?? "-";
    const itemCategory = selectedItem?.Category ?? "-";
    const itemLocation = selectedItem?.Location ?? "-";
    const itemDescription = selectedItem?.Description ?? "-";
    const itemContact = selectedItem?.ContactNumber ?? "-";

    const handleCloseDetailPanel = () => {
        setMarkerClick(false);
    }

    return (
        <section className="flex flex-col flex-1 w-84 bg-white z-40 gap">
            <div className="flex w-full flex-row justify-between">
                <div className="flex flex-row gap">
                    <div className="w-20 h-8 flex justify-center items-center ml-2 bg-green-400/20 rounded-md shadow-2xl">Found</div>
                    <p className="w-20 h-8 flex justify-center items-center">{timing}h ago</p>
                </div>
                <button
                    type="button"
                    onClick={handleCloseDetailPanel}
                    className="flex size-8 items-center mr-2"
                >
                    <X />
                </button>
            </div>
            <Divider className='pb-2'/>
            <h1 className="text-2xl text-center font-bold m-2">{itemName}</h1>
            <div className="flex justify-center items-center">
                <img
                    src="https://majorhifi.com/wp-content/uploads/Sennheiser-HD-400U-3-scaled.jpg"
                    className="rounded-xl w-80 h-60"
                ></img>
            </div>
            <div className="flex items-center px-2 py-2 text-center">
                <div className="flex items-center justify-between gap-2">
                    <Tags />
                    <p className="w-24 text-left">Category</p>
                </div>
                <div className="flex flex-1">{itemCategory}</div>
            </div>
            <div className="flex items-center px-2 py-2 text-center">
                <div className="flex items-center justify-between gap-2">
                    <MapPin />
                    <p className="w-24 text-left">Location</p>
                </div>
                <div className="flex flex-1">{itemLocation}</div>
            </div>
            <div className="flex items-center px-2 py-2 text-center">
                <div className="flex items-center justify-between gap-2">
                    <FileText />
                    <p className="w-24 text-left">Description</p>
                </div>
                <div className="flex flex-1">{itemDescription}</div>
            </div>
            <div className="flex items-center px-2 py-2 text-center">
                <div className="flex items-center justify-between gap-2">
                    <UserRound />
                    <p className="w-24 text-left">Finder</p>
                </div>
                <div className="flex flex-1">{itemContact}</div>
            </div>
            <Divider/>
            <div className='flex flex-1 flex-col mx-2 text-front'>
                <h1 className='mt-2 mx-2 font-semibold'>Contact the finder</h1>
                <h2 className='mx-2'>Message them on telegram now!</h2>
                                    <button
                        type="button"
                        className="flex flex-row items-center gap-2 pl-2 py-2 rounded-xl
                    hover:bg-indigo-500/12 hover:border-slate-200 hover:border hover:text-indigo-600"
                    >
                        <FontAwesomeIcon icon={faTelegram} size='xl' className='text-blue-500'/> {itemContact}
                    </button>
            </div>
        </section>
    );
}
