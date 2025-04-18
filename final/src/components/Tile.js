function Tile({ id, color, number, isHighlighted, isGreyedOut, location, curlo }) {
    let backgroundImage;
    switch (id) {
        case '0':
            backgroundImage = 'url(./images/tileBack.png)';
            break;
        case 'empty':
            backgroundImage = 'url(./images/emptyTile.png)';
            break;
        default:
            backgroundImage = `url('./images/${color}-0${number}.svg')`;
            break;
    }
    if(number === 'j' && id !== '0'){
        backgroundImage = `url('./images/${color}-${number}.png')`;
    }


    const tileClasses = `tile ${isHighlighted ? 'highlight' : ''} ${isGreyedOut ? 'greyout' : ''}`;

    return (
        <div
            id={id}
            className={tileClasses}
            style={{ backgroundImage }}
            data-location={location || ''}
            data-color={color || ''}
            data-number={number || ''}
            data-curlo={curlo || ''}
        />
    );
}

export default Tile;