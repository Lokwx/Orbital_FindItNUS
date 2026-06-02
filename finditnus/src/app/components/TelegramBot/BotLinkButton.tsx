import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTelegram } from '@fortawesome/free-brands-svg-icons';

import Link from 'next/link';

export default function BotLinkButton() {
    return (
        <Link
            href='#'
            className="gap-2 flex flex-1 text-md text-center font-semibold items-center justify-center bg-indigo-400/30 rounded-xl py-2"
        >
            <FontAwesomeIcon
                icon={faTelegram}
                size="xl"
                className="text-blue-500"
            />
            <h1>FindItNUS Telegram Bot</h1>
        </Link>
    );
}
