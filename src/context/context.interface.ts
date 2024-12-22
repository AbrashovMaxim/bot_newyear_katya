import { Context } from "telegraf";

export class OpenRiddle {

    private readonly _id: number;
    private _countPrompts: number;
    private _countWarn: number;
    private _success: boolean;


    constructor(id: number, countPrompts: number, countWarn: number, success: boolean) {
        this._id = id;
        this._countPrompts = countPrompts;
        this._success = success;
        this._countWarn = countWarn;
    }


    get id(): number {
        return this._id;
    }

    get countPrompts(): number {
        return this._countPrompts;
    }
    set countPrompts(value: number) {
        this._countPrompts = value;
    }

    get countWarn(): number {
        return this._countWarn;
    }
    set countWarn(value: number) {
        this._countWarn = value;
    }

    get success(): boolean {
        return this._success;
    }
    set success(value: boolean) {
        this._success = value;
    }

}

export class OpenWish {

    private readonly _id: number;
    private _success: boolean;


    constructor(id: number, success: boolean) {
        this._id = id;
        this._success = success;
    }


    get id(): number {
        return this._id;
    }

    get success(): boolean {
        return this._success;
    }
    set success(value: boolean) {
        this._success = value;
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