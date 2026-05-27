'use client'
import { useState, useEffect } from 'react';
import Hoverbox from "@/app/components/Backup/Hoverbox";
import { getItemData } from "@/Firebase";

export default function ListOfItems(props)
{
    const {range} = props
    const [db, setdb] = useState({
        ItemName: "",
        Location: "",
        ContactNumber: "",
    });

    useEffect(() => {
        const getData = async () => {
            const result = await getItemData()

        setdb({
            ItemName: result.ItemName,
            Location: result.Location,
            ContactNumber: result.ContactNumber,
            });
        }

        getData();
    }, []);


    return (
        <main className="border shadow-2xl bg-white rounded-xl h-[40vh] overflow-y-auto font-semibold">
            <section className="text-center pt-2 pb-0 text-lg">
                Items within {range}
            </section>
            <div className="border my-2"/>
            <section className="space-y-4">
                <Hoverbox
                    item={db.ItemName}
                    phonenumber={db.ContactNumber}
                    location={db.Location}
                />
                <Hoverbox
                    item="Black Wallet"
                    phonenumber="12345678"
                    location="UTown"
                />
                <Hoverbox
                    item="Black Wallet"
                    phonenumber="12345678"
                    location="UTown"
                />
                <Hoverbox
                    item="Black Wallet"
                    phonenumber="12345678"
                    location="UTown"
                />
                <Hoverbox
                    item="Black Wallet"
                    phonenumber="12345678"
                    location="UTown"
                />
                <Hoverbox
                    item="Black Wallet"
                    phonenumber="12345678"
                    location="UTown"
                />
                <Hoverbox
                    item="Black Wallet"
                    phonenumber="12345678"
                    location="UTown"
                />
            </section>
        </main>
    )
}