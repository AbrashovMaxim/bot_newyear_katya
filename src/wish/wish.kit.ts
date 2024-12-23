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
                "Купи носочки ( белый ) теплые 🧦"
            ),
            new WishService(
                4,
                "Купи конфетку 🍬"
            ),
            new WishService(
                5,
                "Купи жидкость для вейпа 🚬"
            ),
            new WishService(
                6,
                "Купи сухарики 🍞"
            ),
            new WishService(
                7,
                "Купи попкорн 🍿"
            ),
            new WishService(
                8,
                "Купи фрутеллу 🍬"
            ),
            new WishService(
                9,
                "Купи киндер пингви 🍫"
            ),
            new WishService(
                10,
                "Купи киндер шоколадку 🍫"
            ),
            new WishService(
                11,
                "Купи молочный шоколад Alpen Gold 🍫"
            ),
            new WishService(
                12,
                "Купи упаковочную бумагу 🎁"
            ),
            new WishService(
                13,
                "Купи пиво 🍺"
            ),
            new WishService(
                14,
                "Купи какао 🧋"
            ),
            new WishService(
                15,
                "Купи немолоко кокосовое 🧉"
            ),
            new WishService(
                16,
                "Купи макарун 🍪"
            ),
            new WishService(
                17,
                "Купи защиту от детей 🔞"
            )
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