import { Action } from "./action.class";
import { Telegraf } from "telegraf";
import { IBotContext, SessionData } from "../context/context.interface";
import { config, riddle, session } from "../utils/base.utils";
import { deleteMessageBot } from "../utils/helper.utils";

export class ShowRiddlesAdminAction extends Action {

    constructor(bot: Telegraf<IBotContext>) { super(bot); }


    handle(): void {
        this.bot.action("showRiddlesAdmin", async (ctx) => {
            await deleteMessageBot(ctx);

            if (ctx.update.callback_query.from.id == config.ADMIN_ID) {
                const userSession = session.getSession(config.USER_ID + ':' + config.USER_ID) as SessionData;

                let riddlesList = "";
                for (const i of riddle.getAllRiddles()) {
                    riddlesList += `\n<b>${i} загадка:</b> ${userSession.openRiddles.some(j => j.id == i) ? (userSession.openRiddles.filter(j => j.id == i)[0].success ? '✅' : '♻') : '❌' } ${userSession.openRiddles.some(j => j.id == i) ? ' | <b>Подсказок:</b> ' + userSession.openRiddles.filter(j => j.id == i)[0].countPrompts + ' | <b>Ошибок: </b>' + userSession.openRiddles.filter(j => j.id == i)[0].countWarn : ''}`
                }

                const inlineKeyboard = [[{ text: 'Обновить загадки ♻', callback_data: 'showRiddlesAdmin'}], [{ text: 'Открыть информацию 📃', callback_data: 'showInfo' }]];
                if (userSession.openWishes.filter(el => !el.success).length > 0) {
                    inlineKeyboard.unshift([{ text: 'Показать задания 🍭', callback_data: 'showWishesAdmin' }]);
                }

                const sendMessage = await ctx.sendMessage(
                    `<b>Загадки пользователя:</b>\n` +
                    riddlesList,
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