import { WishService } from "./wish.service";

export class WishKit {

    private readonly _wishes: WishService[];


    constructor() {
        this._wishes = [
            new WishService(
                0,
                "Купи Kinder Яйцо 🥚"
            ),
            new WishService(
                1,
                "Купи шоколадку Milka молочную 🍫"
            ),
            new WishService(
                2,
                "Купи чупа-чупс 🍭"
            ),
            new WishService(
                3,
                "Купи носочки 🧦"
            ),
            new WishService(
                4,
                "Купи конфетку 🍬"
            ),
            new WishService(
                5,
                "Купи жидкость для вейпа 🚬"
            ),
        ];
    }


    getWish(id: number): WishService | null {
        return this._wishes.find(wish => wish.getId == id) || null;
    }

    getAllWishes(): number[] {
        let allWishes = [] as number[];
        for (const wish of this._wishes) allWishes.push(wish.getId);
        allWishes.sort((a, b) => a - b);
        return allWishes;
    }

}