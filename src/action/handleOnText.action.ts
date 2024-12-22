import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { Action } from "./action.class";
import { IBotContext } from "../context/context.interface";
import { riddle } from "../utils/base.utils";
import { deleteMessageBot } from "../utils/helper.utils";

export class HandleOnTextAction extends Action {

    constructor(bot: Telegraf<IBotContext>) { super(bot); }


    handle(): void {
        this.bot.on(message("text"), async (ctx) => {
            if (ctx.session.selectRiddle != null) {
                const getRiddleObj = riddle.getRiddle(ctx.session.selectRiddle);

                if (getRiddleObj) {
                    await deleteMessageBot(ctx);

                    let message;
                    if (getRiddleObj.getAnswers.includes(ctx.message.text.toLowerCase())) {
                        const inlineKeyboard = [[{ text: 'Открыть информацию 📃', callback_data: 'showInfo' }]];
                        if (ctx.session.openWishes.filter(el => !el.success).length > 0) {
                            inlineKeyboard.unshift([{ text: 'Показать задания 🍭', callback_data: 'showWishes' }]);
                        }
                        message = await ctx.sendMessage(
                            "<b>✅ УСПЕШНО ✅</b>\nТы разгадала загадку и получила букву! 🎊",
                            {
                                parse_mode: 'HTML',
                                reply_markup: {
                                    inline_keyboard: inlineKeyboard
                                }
                            }
                        );

                        const getRiddle = ctx.session.openRiddles.filter(el => el.id == ctx.session.selectRiddle)[0];
                        if (getRiddle) getRiddle.success = true;

                    } else {
                        const inlineKeyboard = [[{ text: 'Открыть информацию 📃', callback_data: 'showInfo' }]];
                        if (ctx.session.openWishes.filter(el => !el.success).length > 0) {
                            inlineKeyboard.unshift([{ text: 'Показать задания 🍭', callback_data: 'showWishes' }]);
                        }
                        if (ctx.session.openRiddles.filter(el => !el.success).length > 0) {
                            inlineKeyboard.unshift([{ text: 'Показать загадку 💬', callback_data: 'showRiddle' }]);
                        }

                        message = await ctx.sendMessage(
                            `<b>❗ ОШИБКА ❗</b>\nТвой ответ: <i></i> "${ctx.message.text}" - <b>НЕВЕРНЫЙ</b>`,
                            {
                                parse_mode: 'HTML',
                                reply_markup: {
                                    inline_keyboard: inlineKeyboard
                                }
                            }
                        );

                        const getRiddle = ctx.session.openRiddles.filter(el => el.id == ctx.session.selectRiddle)[0];
                        if (getRiddle) getRiddle.countWarn++;
                    }

                    ctx.session.botMessage = message.message_id;
                    ctx.session.selectRiddle = null;
                }
            }

            await ctx.deleteMessage(ctx.message.message_id);
        });
    }
}