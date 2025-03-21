import type { WSContext } from "hono/ws";
import Game from "./game";

const games: Record<string, Game | undefined> = {};

class GamesManager {
    constructor() {}

    createGame(playerId: string, ws: WSContext) {
        if (games[playerId]) {
            throw new Error("User is already in a game");
        }

        const game = new Game(playerId, ws);
        games[playerId] = game;
        return game;
    }

    getGame(playerId: string) {
        const game = games[playerId];
        if (!game) {
            throw new Error("User is not in a game");
        }
        return game;
    }

    endGame(playerId: string) {
        delete games[playerId];
    }
}

export default GamesManager;
