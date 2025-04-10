import React, { createContext, useContext, useReducer, useEffect } from 'react';

//currently useless class, remove later


const GameContext = createContext();

const initialState = {
    runBoard: [],
    groupBoard: [],
    playerTiles: [],
    computerTiles: [],
    publicPouch: [],
    used: [],
    remainPouch: [],
    gameStarted: false,
    playerWon: false
};

function gameReducer(state, action) {
    switch (action.type) {
        case 'START_GAME':
            return {
                ...state,
                gameStarted: true
            };
        case 'DRAW_TILE':
            // Logic for drawing a tile would go here
            return state;
        case 'MOVE_TILE':
            // Logic for moving a tile would go here
            return state;
        case 'VALIDATE_BOARD':
            // Logic for validating the board would go here
            return state;
        case 'PLAYER_WIN':
            return {
                ...state,
                playerWon: true
            };
        case 'RESTART_GAME':
            // Reset game logic would go here
            return {
                ...initialState,
                gameStarted: true
            };
        default:
            return state;
    }
}

export function GameProvider({ children }) {
    const [state, dispatch] = useReducer(gameReducer, initialState);

    // This effect would initialize the game when it's first loaded
    useEffect(() => {
        // Initialize game logic would go here
    }, []);

    return (
        <GameContext.Provider value={{ state, dispatch }}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    return useContext(GameContext);
}