import React, { useState } from 'react';
import '../css/style.css'
import {useTranslation} from "react-i18next";

const galleryItems = [
    {
        text: 'Welkom bij Rummikub.',
        subtext: "In dit spel mag je elke beurt je blokjes op tafel leggen en probeer je zo snel mogelijk al je blokjes in je hand weg te spelen. Als je niet als eerste al je blokjes kan wegspelen, krijg je punten van de som van alle blokjes die je nog over hebt. Voor je eerste beurt moet je in totaal 30 punten of meer spelen in blokjes in 1 keer.",
        image: '/images/tutorial-1.png',
    },
    {
        text: 'Om de blokjes in je hand weg te spelen, moet je combinaties maken met de blokjes in je hand en de blokjes die al op het bord liggen.',
        subtext: 'De eerste combinatie die je kunt maken heet een groep. Een groep bestaat uit 3 of 4 blokjes met hetzelfde nummer maar in verschillende kleuren. Op de afbeelding zie je hoe 2 verschillende groepen eruit kunnen zien.',
        image: '/images/tutorial-2.png',
    },
    {
        text: 'Om de blokjes in je hand weg te spelen, moet je combinaties maken met de blokjes in je hand en de blokjes die al op het bord liggen.',
        subtext: 'De tweede combinatie heet een straat. Een straat bestaat uit 3 of meer opeenvolgende nummers van dezelfde kleur, zoals 2-3-4 of 6-7-8-9. Op de afbeelding zie je 3 verschillende straaten. Omdat straten minimum maar 3 blokjes lang moete zijn, kan je hier bijvoorbeeld de zwarte 5 gebruiken in een andere combinatie, de overige straat is nogsteeds lang genoeg dan.',
        image: '/images/tutorial-3.png',
    },
    {
        text: '',
        subtext: 'Er zijn specifieke zones voorzien om je combinaties te leggen. Aan de linkerkant van de afbeelding zie je de plek waar je groepen van hetzelfde nummer kunt neerleggen. Aan de rechterkant is er ruimte voorzien voor het vormen van straten. Voor elke kleur is er een aparte zone: de strepen aan de zijkant geven aan welke kleur je op die rij mag spelen. Zwarte straten mogen op de eerste twee rijen gelegd worden, blauwe op de volgende twee, enzovoort.',
        image: '/images/tutorial-4.png',
    },
    {
        text: '',
        subtext: "Je kunt een blokje spelen of verplaatsen door er met je vinger op te drukken en het naar de gewenste plek te vegen. Laat je vinger los om het blokje daar neer te leggen. Je hoeft niet enkel blokjes uit je eigen hand te gebruiken, je mag ook blokjes uit andere groepen of straten hergebruiken. Zorg er gewoon voor dat uiteindelijk alle blokjes op het speelveld de spelregels volgen, zoals eerder uitgelegd.",
        image: '/images/tutorial-5.png',
    },
    {
        text: 'Hieronder zie je de 3 verschillende knoppen die je ook kan gebruiken.',
        subtext: "De trekknop gebruik je wanneer je geen blokje uit je hand op het spelbord kunt leggen. Dit beëindigt je beurt. De klaar-knop klik je aan wanneer je beurt gedaan is, daarna is de volgende speler aan de beurt. Tijdens het spel kun je soms het hele speelbord herschikken om een blokje uit je hand kwijt te raken. Maar soms loopt dat mis en ligt alles door elkaar. Door op de omkeerknop te klikken, zet het spel automatisch alle blokjes op het bord terug op hun oorspronkelijke plaats. Daarna kun je opnieuw proberen een beurt te doen, of een nieuw blokje van de stapel trekken als je denkt dat er geen geldige zet mogelijk is.",
        image: '/images/tutorial-6.png',
    },
    {
        text: 'Er zijn ook 2 jokers in het spel, deze mogen andere blokjes vervangen en kunnen gaten in je groepen of straten vullen. Voor de eerste beurt neemt de joker de waarde aan van het blokje dat het vervangt',
        subtext: "",
        image: '/images/tutorial-7.png',
    },
];



const GalleryPage = () => {
    const [index, setIndex] = useState(0);
    const { t } = useTranslation();

    const goPrevious = () => {
        setIndex((prev) => (prev === 0 ? galleryItems.length - 1 : prev - 1));
    };

    const goNext = () => {
        setIndex((prev) => (prev === galleryItems.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="gallery-container">
            <div className="gallery-text">
                {galleryItems[index].text}
                {galleryItems[index].subtext && (
                    <div className="gallery-subtext">{galleryItems[index].subtext}</div>
                )}
            </div>

            <div className="gallery-content">
                <button className="gallery-arrow" onClick={goPrevious}>
                    <div className="arrow-label">{t("previous")}</div>
                    ◀
                </button>


                <div className="gallery-image-wrapper">
                    <img
                        src={galleryItems[index].image}
                        alt={`Slide ${index + 1}`}
                        className="gallery-image"
                    />
                </div>

                <button className="gallery-arrow" onClick={goNext}>
                    <div className="arrow-label">{t("next")}</div>
                    ▶
                </button>
            </div>
            <div className="gallery-page-number">
                Pagina {index + 1} / {galleryItems.length}
            </div>
        </div>
    );
};

export default GalleryPage;
