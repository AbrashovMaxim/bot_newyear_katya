import { Telegraf } from "telegraf";
import { IBotContext, SessionData } from "../context/context.interface";
import { Action } from "./action.class";
import { deleteMessageBot } from "../utils/helper.utils";
import { config, riddle, session } from "../utils/base.utils";

export class ShowInfoAction extends Action {

    constructor(bot: Telegraf<IBotContext>) { super(bot); }


    handle(): void {
        this.bot.action('showInfo', async (ctx) => {
            await deleteMessageBot(ctx);
            if (ctx.update.callback_query.from.id == config.ADMIN_ID) {
                const userSession = session.getSession(config.USER_ID + ':' + config.USER_ID) as SessionData;

                const chatMember = await this.bot.telegram.getChatMember(config.USER_ID, config.USER_ID);
                const userInfo = chatMember.user;

                const inlineKeyboard = [
                    [{ text: 'Обновить информацию ♻', callback_data: 'showInfo'}],
                    [{ text: 'Показать загадки 💬', callback_data: 'showRiddlesAdmin' }],
                    [{ text: 'Показать задания 🍭', callback_data: 'showWishesAdmin' }]
                ];
                const sendMessage = await ctx.sendMessage(
                    `<b>Информация о пользователе:</b>\n\n` +
                    `--------------------------\n` +
                    `<b>Имя:</b> ${userInfo.first_name} ${userInfo.last_name || ''}\n` +
                    `<b>Юзернейм:</b> @${userInfo.username || 'не указан'}\n` +
                    `--------------------------\n\n` +
                    `<b>Открыто букв</b>: <code>${riddle.getOpenRiddles(userSession.openRiddles)}</code>\n`,
                    {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: inlineKeyboard
                        }
                    });

                await deleteMessageBot(ctx);

                ctx.session.botMessage = sendMessage.message_id;
            }
            if (ctx.update.callback_query.from.id == config.USER_ID) {
                const userSession = session.getSession(ctx.update.callback_query.from.id + ':' + ctx.update.callback_query.from.id) as SessionData;

                const chatMember = await this.bot.telegram.getChatMember(ctx.update.callback_query.from.id, ctx.update.callback_query.from.id);
                const userInfo = chatMember.user;

                let riddlesList = "";
                for (const i of riddle.getAllRiddles()) {
                    riddlesList += `\n<b>${i} загадка:</b> ${userSession.openRiddles.some(j => j.getId == i) ? '✅' : '❌' }`
                }
                const inlineKeyboard = [[{ text: 'Обновить информацию ♻', callback_data: 'showInfo'}]];
                if (ctx.session.openRiddles.filter(el => !el.getSuccess).length > 0) {
                    inlineKeyboard.push([{ text: 'Показать загадку 💬', callback_data: 'showRiddle' }]);
                }
                if (ctx.session.openWishes.filter(el => !el.getSuccess).length > 0) {
                    inlineKeyboard.push([{ text: 'Показать задания 🍭', callback_data: 'showWishes' }]);
                }
                const sendMessage = await ctx.sendMessage(
                    `<b>Информация о тебе:</b>\n\n` +
                    `--------------------------\n` +
                    `<b>Имя:</b> ${userInfo.first_name} ${userInfo.last_name || ''}\n` +
                    `<b>Юзернейм:</b> @${userInfo.username || 'не указан'}\n` +
                    `--------------------------\n\n` +
                    `<b>Открыто букв</b>: <code>${riddle.getOpenRiddles(userSession.openRiddles)}</code>`,
                    {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: inlineKeyboard
                        }
                    });

                await deleteMessageBot(ctx);

                ctx.session.selectRiddle = null;
                ctx.session.botMessage = sendMessage.message_id;
            }
        });
    }

}