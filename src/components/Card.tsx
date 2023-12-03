import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

type CardProps = {
    title: string;
    subtitle: string;
    url: string;
    screenshots: string[];
};

function Card({ title, url, screenshots, subtitle }: CardProps) {
    return (
        <div className="p-4 inline rounded-lg bg-black bg-opacity-40">
            {screenshots.length > 0 && (
                <div className="flex flex-wrap max-w-max mx-auto justify-center items-center mb-8 p-4 rounded-lg gap-2">
                    {screenshots.map((s) => (
                        <Zoom>
                            <img src={s} width="240" className="rounded-lg" />
                        </Zoom>
                    ))}
                </div>
            )}
            <div className="space-x-2 pb-2 flex flex-col w-full justify-center items-center">
                <span className="text-4xl font-josefin-bold pb-1">{title}</span>
                <span className="font-josefin-bold opacity-80 text-xl">{subtitle}</span>
            </div>
            <a
                href={url}
                className="text-blue-500 text-sm opacity-80 hover:opacity-60 font-mono font-bold"
                target="_blank"
                referrerPolicy="no-referrer"
            >
                {url}
            </a>
        </div>
    );
}

export default Card;
