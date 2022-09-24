import { ColorResolvable } from "discord.js";

class Bot {
    public static readonly defaultPrefix = process.env.BOT_PREFIX || '!';
    public static readonly defaultBotHexColor: ColorResolvable = `#${process.env.BOT_MESSAGE_EMBED_HEX_COLOR}` || '#FFFFFF';
    public static readonly nickname = process.env.BOT_NAME || 'Poing';
    public static readonly ID = process.env.BOT_ID;
    public static readonly urlWebApp = process.env.BOT_URL_WEB_APP
}

export default Bot;