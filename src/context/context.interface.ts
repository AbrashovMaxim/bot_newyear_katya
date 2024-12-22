import { Context } from "telegraf";

export class OpenRiddle {

    public readonly id: number;
    public countPrompts: number;
    public countWarn: number;
    public success: boolean;


    constructor(id: number, countPrompts: number, countWarn: number, success: boolean) {
        this.id = id;
        this.countPrompts = countPrompts;
        this.countWarn = countWarn;
        this.success = success;
    }

}

export class OpenWish {

    public readonly id: number;
    public success: boolean;


    constructor(id: number, success: boolean) {
        this.id = id;
        this.success = success;
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