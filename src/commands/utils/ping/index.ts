import { BotCommand } from "../../index.types";
import locale from '../../../locale/example.locale.json';
import execDefaultCommand from "./command.default";
import execSlashCommand from "./command.slash";
import MD from "../../../utils/md";

const command: BotCommand = {
    name: 'ping',
    howToUse: MD.codeBlock.line('{bot.prefix}ping'),
    category: locale.category.utility,
    description: locale.command.ping.description,
    aliases: ['p'],
    execSlash: execSlashCommand,
    execDefault: execDefaultCommand
}

export default command;

