import { Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";

export abstract class Action {

    protected constructor(protected bot: Telegraf<IBotContext>) { }

    abstract handle(): void;

}