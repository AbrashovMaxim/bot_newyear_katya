import { Telegraf } from "telegraf";
import { IBotContext, OpenWish } from "../context/context.interface";
import { Action } from "./action.class";
import { deleteMessageBot } from "../utils/helper.utils";
import { riddle, wish } from "../utils/base.utils";

export class GetPromptAction extends Action {

    constructor(bot: Telegraf<IBotContext>) { super(bot); }


    handle(): void {
        this.bot.action('getPrompt', async (ctx) => {
            await deleteMessageBot(ctx);

            const getRiddle = ctx.session.openRiddles.find(el => !el.getSuccess) || null;
            let userMessage = null;
            if (getRiddle) {
                if (getRiddle.getCountPrompts < 3) {
                    getRiddle.setCountPrompts++;
                    const openWishes = wish.getAllWishes().filter(idWish => ctx.session.openWishes.length === 0 ? true : ctx.session.openWishes.every(el => el.getId !== idWish));
                    if (openWishes.length > 0) {
                        const getWishObj = wish.getWish(openWishes[0]);
                        if (getWishObj) ctx.session.openWishes.push(new OpenWish(getWishObj.getId, false));
                    }
                }

                const getRiddleObj = riddle.getRiddle(getRiddle.getId);
                if (getRiddleObj) {
                    let prompts = "";
                    if (getRiddle.getCountPrompts > 0) {
                        prompts += "\n\n<b>Подсказки:</b>\n<pre>";
                        for (let i = 0; i < getRiddle.getCountPrompts; i++) {
                            prompts += (i + 1) + ". " + getRiddleObj.getPrompts[i];
                            if (i + 1 < getRiddle.getCountPrompts) prompts += "\n";
                        }
                        prompts += "</pre>";
                    }

                    const inlineKeyboard = [[{ text: 'Открыть информацию 📃', callback_data: 'showInfo' }]];
                    if (getRiddle.getCountPrompts < 3) {
                        inlineKeyboard.unshift([{ text: 'Получить подсказку 📈', callback_data: 'getPrompt' }]);
                    }
                    if (ctx.session.openWishes.filter(el => !el.getSuccess).length > 0) {
                        inlineKeyboard.push([{ text: 'Показать задания 🍭', callback_data: 'showWishes' }]);
                    }

                    userMessage = await ctx.sendMessage(
                        getRiddleObj.getText + prompts,
                        {
                            parse_mode: 'HTML',
                            reply_markup: {
                                inline_keyboard: inlineKeyboard
                            }
                        }
                    );
                    ctx.session.selectRiddle = getRiddle.getId;
                }
            } else {
                userMessage = await ctx.sendMessage(
                    "<b>❗ ОШИБКА ❗</b>\nНовая загадка пока-что тебе не выдана, ожидай 🫠",
                    {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: 'Открыть информацию 📃', callback_data: 'showInfo' }]
                            ]
                        }
                    }
                );
                ctx.session.selectRiddle = null;
            }

            ctx.session.botMessage = userMessage ? userMessage.message_id : null;
        });
    }

}