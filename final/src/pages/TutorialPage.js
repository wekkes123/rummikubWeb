import { useState } from 'react';

const galleryItems = [
    {
        text: 'Welcome to our App Gallery!',
        image: '/images/1-j.png',
    },
    {
        text: 'This is our second amazing feature.',
        image: '/images/1-j.png',
    },
    {
        text: 'Explore more with this great tool.',
        image: '/images/1-j.png',
    },
];

const GalleryPage= () => {
    const [index, setIndex] = useState(0);

    const goPrevious = () => {
        setIndex((prev) => (prev === 0 ? galleryItems.length - 1 : prev - 1));
    };

    const goNext = () => {
        setIndex((prev) => (prev === galleryItems.length - 1 ? 0 : prev + 1));
    };

    return (
        <main className="flex flex-col items-center justify-center w-screen h-screen bg-white touch-none select-none">
            <div className="text-2xl md:text-4xl font-semibold text-center p-4 max-w-xl">
                {galleryItems[index].text}
            </div>

            <div className="flex items-center justify-center w-full h-full px-4">
                <button onClick={goPrevious} className="text-4xl p-4 select-none">
                    ◀
                </button>

                <div className="flex-1 flex items-center justify-center">
                    <img
                        src={galleryItems[index].image}
                        alt={`Slide ${index + 1}`}
                        className="max-h-[80vh] max-w-full object-contain"
                    />
                </div>

                <button onClick={goNext} className="text-4xl p-4 select-none">
                    ▶
                </button>
            </div>
        </main>
    );
}

export default GalleryPage;