export class WishService {

    private readonly id: number;
    private readonly text: string;

    constructor(
        id: number,
        text: string,
    ) {
        this.id = id;
        this.text = text;
    }

    get getId(): number {
        return this.id;
    }

    get getText(): string {
        return this.text;
    }

}