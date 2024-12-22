import { Command } from "./command.class";
import { IBotContext, SessionData } from "../context/context.interface";
import { Telegraf } from "telegraf";
import { config, session } from "../utils/base.utils";
import { deleteMessageBot } from "../utils/helper.utils";

export class RemindCommand extends Command {

    constructor(bot: Telegraf<IBotContext>) { super(bot); }


    handle(): void {
        this.bot.command("remind", async (ctx) => {
            await ctx.deleteMessage(ctx.message.message_id);

            await deleteMessageBot(ctx);

            if (ctx.message.from.id == config.ADMIN_ID) {
                let message;

                const userSession = session.getSession(config.USER_ID + ':' + config.USER_ID) as SessionData;

                const activateRiddle = userSession.openRiddles.filter(el => !el.success);

                if (activateRiddle.length > 0) {
                    if (userSession.botMessage) {
                        await this.bot.telegram.deleteMessage(config.USER_ID, userSession.botMessage);
                        userSession.botMessage = null;
                    }

                    message = await ctx.sendMessage("<b>✅ УСПЕШНО ✅</b>\nНапоминание отправлено!", { parse_mode: 'HTML' });

                    const userMessage = await this.bot.telegram.sendMessage(
                        config.USER_ID,
                        "<b>❗ НАПОМИНАНИЕ ❗</b>\nТебе нужно выполнить загадку в течение часа, либо, ты не получишь подарок на <b>новый год</b> 🙃",
                        {
                            parse_mode: 'HTML',
                            reply_markup: {
                                inline_keyboard: [
                                    [
                                        { text: 'Показать загадку 💬', callback_data: 'showRiddle' },
                                    ],
                                    [
                                        { text: 'Открыть информацию 📃', callback_data: 'showInfo' }
                                    ]
                                ]
                            }
                        }
                    );

                    userSession.selectRiddle = null;
                    userSession.botMessage = userMessage.message_id;


                } else {
                    message = await ctx.sendMessage("<b>❗ ОШИБКА ❗</b>\nУ пользователей нету выполняемых загадок!", { parse_mode: 'HTML' });
                }

                ctx.session.botMessage = message.message_id;
            }
        });
    }

}