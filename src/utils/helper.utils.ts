import { IBotContext } from "../context/context.interface";

async function deleteMessageBot(ctx: IBotContext) {
    try {
        if (ctx.session.botMessage) await ctx.deleteMessage(ctx.session.botMessage);
    } catch (e) {}

    ctx.session.botMessage = null;
}

export { deleteMessageBot }