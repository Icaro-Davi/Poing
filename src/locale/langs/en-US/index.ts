import type BaseLocale from "../../baseLocale";
import category from "./category";
import error from "./error";
import interaction from "./interaction";
import labels from "./labels";
import command from './commands';
import messageActionRow from "./components/messageActionRow";
import messageEmbed from "./components/messageEmbed";
import module from "./modules";
import status from "./status";
import usage from "./usage";

const en_US: BaseLocale = {
    localeLabel: 'en-US',
    category,
    error,
    interaction,
    labels,
    command,
    messageActionRow,
    messageEmbed,
    module,
    status,
    usage
}

export default en_US;