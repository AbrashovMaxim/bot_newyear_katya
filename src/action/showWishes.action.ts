import { Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";
import { Action } from "./action.class";
import { deleteMessageBot } from "../utils/helper.utils";
import { wish } from "../utils/base.utils";

export class ShowWishesAction extends Action {

    constructor(bot: Telegraf<IBotContext>) { super(bot); }


    handle(): void {
        this.bot.action('showWishes', async (ctx) => {
            await deleteMessageBot(ctx);

            const getRiddle = ctx.session.openRiddles.find(el => !el.success) || null;
            const getWishes = ctx.session.openWishes.filter(el => !el.success);

            let userMessage;

            const inlineKeyboard = [[{ text: 'Обновить задания ♻', callback_data: 'showWishes'}], [{ text: 'Открыть информацию 📃', callback_data: 'showInfo' }]];
            if (getRiddle) {
                inlineKeyboard.unshift([{ text: 'Показать загадку 💬', callback_data: 'showRiddle' }]);
            }

            if (getWishes.length > 0) {
                let wishesMessage = "<b>Задания, которые ты должна выполнить: </b>\n\n";
                for (let i = 0; i < getWishes.length; i++) {
                    const getWishesObject = wish.getWish(getWishes[i].id);
                    wishesMessage += "<b>" + (i + 1) + ". </b>" + getWishesObject?.getText + "\n";
                }

                userMessage = await ctx.sendMessage(
                    wishesMessage,
                    {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: inlineKeyboard
                        }
                    }
                );
            } else {
                userMessage = await ctx.sendMessage(
                    "<b>❗ ОШИБКА ❗</b>\nУ тебя пока что нету заданий" + (getRiddle ? ", но ты можешь взять подсказку 🤡" : " 😒"),
                    {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: inlineKeyboard
                        }
                    }
                );
            }

            ctx.session.selectRiddle = null;
            ctx.session.botMessage = userMessage ? userMessage.message_id : null;
        });
    }

}