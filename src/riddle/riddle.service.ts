export class RiddleService {

    private readonly id: number;
    private readonly symbol: string;
    private readonly text: string;
    private readonly answers: string[];
    private readonly prompts: string[];

    constructor(
        id: number,
        symbol: string,
        text: string,
        answers: string[],
        prompts: string[],
    ) {
        this.id = id;
        this.symbol = symbol;
        this.text = text;
        this.answers = answers;
        this.prompts = prompts;
    }

    get getId(): number {
        return this.id;
    }

    get getSymbol(): string {
        return this.symbol;
    }

    get getText(): string {
        return this.text;
    }

    get getAnswers(): string[] {
        return this.answers;
    }

    get getPrompts(): string[] {
        return this.prompts;
    }

}