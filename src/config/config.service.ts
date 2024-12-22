import { config, DotenvParseOutput } from "dotenv";
import { IConfigService } from "./config.interface";

export class ConfigService implements IConfigService {

    private readonly config: DotenvParseOutput;

    public readonly ADMIN_ID: number;
    public readonly USER_ID: number;


    constructor() {
        const { error, parsed } = config();

        if (error) {
            throw new Error('На найден файл .env');
        }
        if (!parsed) {
            throw new Error('Файл .env - пуст!');
        }

        this.config = parsed;

        this.ADMIN_ID = parseInt(this.get("ADMIN"));
        this.USER_ID = parseInt(this.get("USER"));
    }


    get(key: string): string {
        const res  = this.config[key];
        if (!res) {
            throw new Error("Не найден ключ: " + key);
        }
        return res;
    }

}