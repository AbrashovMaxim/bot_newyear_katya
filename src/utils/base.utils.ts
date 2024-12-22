import LocalSession from "telegraf-session-local";
import { ConfigService } from "../config/config.service";
import { RiddleKit } from "../riddle/riddle.kit";
import { WishKit } from "../wish/wish.kit";

const config = new ConfigService();
const riddle = new RiddleKit();
const wish = new WishKit();
const session = new LocalSession({
    database: 'sessions.json',
    storage: LocalSession.storageFileSync
})

export { config, riddle, wish, session };