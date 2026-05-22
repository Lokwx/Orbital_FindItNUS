import Hoverbox from "@/app/components/Hoverbox";

export default function ListOfItems(props)
{
    const {range} = props
    return (
        <main className="border shadow-2xl bg-white rounded-xl h-[40vh] overflow-y-auto font-semibold">
            <section className="text-center pt-2 pb-0 text-lg">
                Items within {range}
            </section>
            <div className="border my-2"/>
            <section className="space-y-4">
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