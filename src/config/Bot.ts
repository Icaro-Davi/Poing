import { ColorResolvable } from "discord.js";

class Bot {
    public static defaultPrefix = process.env.BOT_PREFIX || '!';
    public static defaultBotHexColor: ColorResolvable = `#${process.env.BOT_MESSAGE_EMBED_HEX_COLOR}` || '#FFFFFF';
    public static nickname = process.env.BOT_NAME || 'Poing';
}

export default Bot;