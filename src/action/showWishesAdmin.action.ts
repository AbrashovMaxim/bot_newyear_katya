import { Telegraf } from "telegraf";
import { Action } from "./action.class";
import { IBotContext, SessionData } from "../context/context.interface";
import { deleteMessageBot } from "../utils/helper.utils";
import { config, session, wish } from "../utils/base.utils";

export class ShowWishesAdminAction extends Action {

    constructor(bot: Telegraf<IBotContext>) { super(bot); }


    handle(): void {
        this.bot.action("showWishesAdmin", async (ctx) => {
            await deleteMessageBot(ctx);

            if (ctx.update.callback_query.from.id == config.ADMIN_ID) {
                const userSession = session.getSession(config.USER_ID + ':' + config.USER_ID) as SessionData;

                let wishesList = "";
                for (const i of wish.getAllWishes()) {
                    wishesList += `\n<b>${i} желание:</b> ${userSession.openWishes.some(j => j.id == i) ? (userSession.openWishes.filter(j => j.id == i)[0].success ? '✅' : '♻') : '❌' }`
                }

                const inlineKeyboard = [[{ text: 'Обновить задания ♻', callback_data: 'showWishesAdmin'}], [{ text: 'Открыть информацию 📃', callback_data: 'showInfo' }]];
                if (userSession.openRiddles.filter(el => !el.success).length > 0) {
                    inlineKeyboard.unshift([{ text: 'Показать загадки 💬', callback_data: 'showRiddlesAdmin' }]);
                }

                const sendMessage = await ctx.sendMessage(
                    `<b>Задания пользователя:</b>\n` +
                    wishesList,
                    {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: inlineKeyboard
                        }
                    }
                );

                ctx.session.botMessage = sendMessage.message_id;
            }
        });
    }

}
