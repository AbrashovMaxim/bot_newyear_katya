import {Command} from "./command.class";
import {Telegraf} from "telegraf";
import {IBotContext, SessionData} from "../context/context.interface";
import {config, riddle, session, wish} from "../utils/base.utils";
import {deleteMessageBot} from "../utils/helper.utils";

export class WishCommand extends Command {

    constructor(bot: Telegraf<IBotContext>) { super(bot); }


    handle(): void {
        this.bot.command("wish", async (ctx) => {
            await ctx.deleteMessage(ctx.message.message_id);

            if (ctx.message.from.id == config.ADMIN_ID) {
                const split = ctx.message.text.split(' ');
                if (split.length == 2) {
                    await deleteMessageBot(ctx);

                    const id = parseInt(split[1]);

                    const userSession = session.getSession(config.USER_ID + ':' + config.USER_ID) as SessionData;

                    const inlineKeyboard = [[{text: 'Открыть информацию 📃', callback_data: 'showInfo'}]];
                    if (userSession.openWishes.filter(el => !el.getSuccess).length > 0) {
                        inlineKeyboard.unshift([{text: 'Показать задания 🍭', callback_data: 'showWishesAdmin'}]);
                    }
                    if (userSession.openRiddles.filter(el => !el.getSuccess).length > 0) {
                        inlineKeyboard.unshift([{text: 'Показать загадки 💬', callback_data: 'showRiddlesAdmin'}]);
                    }

                    if (!wish.getAllWishes().includes(id)) {
                        const message = await ctx.sendMessage(
                            "<b>❗ ОШИБКА ❗</b>\nТакого задания <b>не существует</b> <b>ID: " + id + "</b>",
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

                    const successWish = userSession.openWishes.find(wish => wish.getId == id);
                    if (successWish == null) {
                        const message = await ctx.sendMessage(
                            "<b>❗ ОШИБКА ❗</b>\nУ пользователя <b>нету</b> такого задания <b>ID: " + id + "</b>",
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


                    if (successWish.getSuccess) {
                        const message = await ctx.sendMessage(
                            "<b>❗ ОШИБКА ❗</b>\nУ пользователя <b>выполнено</b> данное задание <b>ID: " + id + "</b>",
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
                        "<b>✅ УСПЕШНО ✅</b>\nЗадание <b>ID: " + id + " - ВЫПОЛНЕНО</b>!",
                        {
                            parse_mode: 'HTML',
                            reply_markup: {
                                inline_keyboard: inlineKeyboard
                            }
                        }
                    );
                    ctx.session.botMessage = message.message_id;
                    successWish.setSuccess = true;
                }
            }
        });
    }
}