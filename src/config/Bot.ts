class Bot {
    public static readonly defaultPrefix = process.env.BOT_PREFIX || '!';
    public static readonly defaultBotHexColor = `#${process.env.BOT_MESSAGE_EMBED_HEX_COLOR}` || '#FFFFFF';
    public static readonly nickname = process.env.BOT_NAME || 'Poing';
    public static readonly ID = process.env.BOT_ID;
    public static readonly urlWebApp = process.env.BOT_URL_WEB_APP

    static getDefaultVars(){
        return {
            prefix: this.defaultPrefix,
            hexColor: this.defaultBotHexColor,
            name: this.nickname,
            '@mention': `<@${this.ID}>`
        }
    }
}

export default Bot;