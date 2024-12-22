import { Command } from "./command.class";
import { IBotContext, OpenRiddle, SessionData } from "../context/context.interface";
import { Telegraf } from "telegraf";
import { config, session, riddle } from "../utils/base.utils";
import { deleteMessageBot } from "../utils/helper.utils";

export class SendCommand extends Command {

    constructor(bot: Telegraf<IBotContext>) { super(bot); }


    handle(): void {
        this.bot.command("send", async (ctx) => {
            await ctx.deleteMessage(ctx.message.message_id);

            if (ctx.message.from.id == config.ADMIN_ID) {
                const split = ctx.message.text.split(' ');
                if (split.length == 2) {
                    await deleteMessageBot(ctx);

                    const id = parseInt(split[1]);

                    const userSession = session.getSession(config.USER_ID + ':' + config.USER_ID) as SessionData;

                    const inlineKeyboard = [[{ text: 'Открыть информацию 📃', callback_data: 'showInfo' }]];
                    if (userSession.openWishes.filter(el => !el.getSuccess).length > 0) {
                        inlineKeyboard.unshift([{ text: 'Показать задания 🍭', callback_data: 'showWishesAdmin' }]);
                    }
                    if (userSession.openRiddles.filter(el => !el.getSuccess).length > 0) {
                        inlineKeyboard.unshift([{ text: 'Показать загадки 💬', callback_data: 'showRiddlesAdmin' }]);
                    }

                    if (!riddle.getAllRiddles().includes(id)) {
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

                    const openRiddles = userSession.openRiddles.filter(riddle => !riddle.getSuccess);
                    if (openRiddles.length != 0) {
                        const message = await ctx.sendMessage(
                            "<b>❗ ОШИБКА ❗</b>\nУ пользователя <b>есть</b> открытая загадка <b>ID: " + openRiddles[0].getId + "</b>",
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

                    const useRiddles = userSession.openRiddles.filter(riddle => riddle.getId == id);
                    if (useRiddles.length != 0) {
                        const message = await ctx.sendMessage(
                            "<b>❗ ОШИБКА ❗</b>\nПользователь уже <b>открыл</b> эту загадку <b>ID: " + useRiddles[0].getId + "</b>",
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
                        "<b>✅ УСПЕШНО ✅</b>\nЗагадка <b>ID: " + id + " - НАЧАТА</b>!",
                        {
                            parse_mode: 'HTML',
                            reply_markup: {
                                inline_keyboard: inlineKeyboard
                            }
                        }
                    );
                    ctx.session.botMessage = message.message_id;
                    userSession.openRiddles.push(new OpenRiddle(id, 0, 0, false));

                    const getRiddle = riddle.getRiddle(id);
                    if (getRiddle) {
                        const userInlineKeyboard = [[{ text: 'Открыть информацию 📃', callback_data: 'showInfo' }]];
                        if (userSession.openWishes.filter(el => !el.getSuccess).length > 0) {
                            userInlineKeyboard.unshift([{ text: 'Показать задания 🍭', callback_data: 'showWishes' }]);
                        }
                        userInlineKeyboard.unshift([{ text: 'Получить подсказку 📈', callback_data: 'getPrompt' }]);

                        const userMessage = await this.bot.telegram.sendMessage(
                            config.USER_ID,
                            getRiddle.getText,
                            {
                                parse_mode: 'HTML',
                                reply_markup: {
                                    inline_keyboard: userInlineKeyboard
                                }
                            }
                        );

                        if (userSession.botMessage) {
                            await this.bot.telegram.deleteMessage(config.USER_ID, userSession.botMessage);
                            userSession.botMessage = null;
                        }
                        userSession.selectRiddle = id;
                        userSession.botMessage = userMessage.message_id;
                    }
                }
            }
        });
    }

}