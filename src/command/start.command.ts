import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";
import { Telegraf } from "telegraf";

export class StartCommand extends Command {

    constructor(bot: Telegraf<IBotContext>) { super(bot); }


    handle(): void {
        this.bot.start(async (ctx) => {
            if (!ctx.session.botMessage) {
                ctx.session.botMessage = null;
            }

            if (!ctx.session.openRiddles) {
                ctx.session.openRiddles = [];
            }

            await ctx.deleteMessage(ctx.message.message_id);
        });
    }

}