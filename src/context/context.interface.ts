import { Context } from "telegraf";

export class OpenRiddle {

    private readonly id: number;
    private countPrompts: number;
    private countWarn: number;
    private success: boolean;


    constructor(id: number, countPrompts: number, countWarn: number, success: boolean) {
        this.id = id;
        this.countPrompts = countPrompts;
        this.countWarn = countWarn;
        this.success = success;
    }


    get getId(): number {
        return this.id;
    }

    get getCountPrompts(): number {
        return this.countPrompts;
    }
    set setCountPrompts(value: number) {
        this.countPrompts = value;
    }

    get getCountWarn(): number {
        return this.countWarn;
    }
    set setCountWarn(value: number) {
        this.countWarn = value;
    }

    get getSuccess(): boolean {
        return this.success;
    }
    set setSuccess(value: boolean) {
        this.success = value;
    }

}

export class OpenWish {

    private readonly id: number;
    private success: boolean;


    constructor(id: number, success: boolean) {
        this.id = id;
        this.success = success;
    }


    get getId(): number {
        return this.id;
    }

    get getSuccess(): boolean {
        return this.success;
    }
    set setSuccess(value: boolean) {
        this.success = value;
    }

}

export interface SessionData {

    botMessage: number | null;
    openRiddles: OpenRiddle[];
    selectRiddle: number | null;
    openWishes: OpenWish[];

}

export interface IBotContext extends Context {

    session: SessionData;

}