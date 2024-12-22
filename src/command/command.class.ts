import { Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";

export abstract class Command {

    protected constructor(protected bot: Telegraf<IBotContext>) { }

    abstract handle(): void;

}