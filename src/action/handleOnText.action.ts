import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { Action } from "./action.class";
import {IBotContext, OpenRiddle} from "../context/context.interface";
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
                        if (ctx.session.openWishes.filter(el => !el.getSuccess).length > 0) {
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

                        const getRiddle = ctx.session.openRiddles.filter(el => el.getId == ctx.session.selectRiddle)[0] as OpenRiddle | null;
                        if (getRiddle) getRiddle.setSuccess = true;

                    } else {
                        const inlineKeyboard = [[{ text: 'Открыть информацию 📃', callback_data: 'showInfo' }]];
                        if (ctx.session.openWishes.filter(el => !el.getSuccess).length > 0) {
                            inlineKeyboard.unshift([{ text: 'Показать задания 🍭', callback_data: 'showWishes' }]);
                        }
                        if (ctx.session.openRiddles.filter(el => !el.getSuccess).length > 0) {
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

                        const getRiddle = ctx.session.openRiddles.filter(el => el.getId == ctx.session.selectRiddle)[0];
                        if (getRiddle) getRiddle.setCountWarn++;
                    }

                    ctx.session.botMessage = message.message_id;
                    ctx.session.selectRiddle = null;
                }
            }

            await ctx.deleteMessage(ctx.message.message_id);
        });
    }
}