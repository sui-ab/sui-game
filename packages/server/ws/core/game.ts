import type { WSContext } from "hono/ws";
import { randomChoiceFromArray } from "../../common/utils";
import cryptids from "./cryptids";

type Slot = {
    id: number;
    item: number;
    hp: number;
    attack: number;
};

const notifier = (data: any) => {
    console.log(data);
};

class Game {
    playerId: string;
    lineup: Slot[] = [];
    shop: number[] = [];
    notifier = notifier;

    constructor(playerId: string) {
        this.playerId = playerId;
        this._roll();
    }

    private _roll() {
        this.shop = [];
        for (let i = 0; i < 5; i++) {
            this.shop.push(randomChoiceFromArray(cryptids).id);
        }
    }
}

export default Game;
