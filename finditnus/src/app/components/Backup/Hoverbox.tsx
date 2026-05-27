export default function Hoverbox(props) {
    const {item, phonenumber, location} = props;
    return (
        <main
            className="border border-black shadow-sm bg-neutral-50 p-0 rounded-xl"
        >
            <section className="px-5 py-2 flex flex-col">
                <div>Item: {item}</div>
                <div>Contact Number: {phonenumber}</div>
                <div>Location: {location}</div>
            </section>
        </main>
    )
}
