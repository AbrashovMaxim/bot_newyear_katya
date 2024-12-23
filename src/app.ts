import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { ConfigService } from "./config/config.service";
import { IConfigService } from "./config/config.interface";
import { Command } from "./command/command.class";
import { StartCommand } from "./command/start.command";
import { InfoCommand } from "./command/info.command";
import { SendCommand } from "./command/send.command";
import { RemindCommand } from "./command/remind.command";
import { Action } from "./action/action.class";
import { IBotContext } from "./context/context.interface";
import { session } from "./utils/base.utils";
import { GetPromptAction } from "./action/getPrompt.action";
import { HandleOnTextAction } from "./action/handleOnText.action";
import { ShowInfoAction } from "./action/showInfo.action";
import { ShowRiddleAction } from "./action/showRiddle.action";
import { ShowWishesAction } from "./action/showWishes.action";
import {WishCommand} from "./command/wish.class";
import {ShowWishesAdminAction} from "./action/showWishesAdmin.action";
import {ShowRiddlesAdminAction} from "./action/showRiddlesAdmin.action";
import {TaskCommand} from "./command/task.command";


class Bot {

    private readonly commands: Command[];
    private readonly actions: Action[];
    private readonly bot: Telegraf<IBotContext>;


    constructor(private readonly configService: IConfigService) {
        this.bot = new Telegraf<IBotContext>(configService.get("TOKEN"));
        this.bot.use(session.middleware());

        this.commands = [
            new StartCommand(this.bot),
            new InfoCommand(this.bot),
            new SendCommand(this.bot),
            new RemindCommand(this.bot),
            new WishCommand(this.bot),
            new TaskCommand(this.bot)
        ];

        this.actions = [
            new GetPromptAction(this.bot),
            new ShowInfoAction(this.bot),
            new ShowRiddleAction(this.bot),
            new ShowRiddlesAdminAction(this.bot),
            new ShowWishesAction(this.bot),
            new ShowWishesAdminAction(this.bot),
            new HandleOnTextAction(this.bot)
        ];
    }

    init() {
        for (const command of this.commands) command.handle();
        for (const action of this.actions) action.handle()

        this.bot.launch().then(r => console.log("Бот запущен!"));
    }

}

const bot = new Bot(new ConfigService());
bot.init();