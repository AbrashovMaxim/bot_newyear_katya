import { Command } from "./command.class";
import { IBotContext, OpenRiddle, SessionData } from "../context/context.interface";
import { Telegraf } from "telegraf";
import { config, session, riddle } from "../utils/base.utils";
import { deleteMessageBot } from "../utils/helper.utils";

export class TaskCommand extends Command {

    constructor(bot: Telegraf<IBotContext>) { super(bot); }


    handle(): void {
        this.bot.command("task", async (ctx) => {
            await ctx.deleteMessage(ctx.message.message_id);

            if (ctx.message.from.id == config.ADMIN_ID) {
                const split = ctx.message.text.split(' ');
                if (split.length == 2) {
                    await deleteMessageBot(ctx);

                    const id = parseInt(split[1]);

                    const inlineKeyboard = [[{ text: 'Открыть информацию 📃', callback_data: 'showInfo' }]];

                    const getRiddle = riddle.getRiddle(id);
                    if (!getRiddle) {
                        const message = await ctx.sendMessage(
                            "<b>❗ ОШИБКА ❗</b>\nТакой загадки <b>не существует</b> <b>ID: " + id + "</b>",
                            {
                                parse_mode: 'HTML',
                                reply_markup: {
                                    inline_keyboard: inlineKeyboard
                                }
                            }
                        );
                        ctx.session.botMessage = message.message_id;
                        return;
                    }

                    const message = await ctx.sendMessage(
                        `<b>❕ ИНФОРМАЦИЯ ❕</b>\nЗагадка <b>ID: ${id}:</b>!\n\n` +
                        `${getRiddle.getText}\n\n` +
                        `<b>Ответы:</b> <pre>${getRiddle.getAnswers.join(" | ")}</pre>\n` +
                        `<b>Подсказки:</b> <pre>${getRiddle.getPrompts.join(" | ")}</pre>`,
                        {
                            parse_mode: 'HTML',
                            reply_markup: {
                                inline_keyboard: inlineKeyboard
                            }
                        }
                    );
                    ctx.session.botMessage = message.message_id;
                }
            }
        });
    }

}