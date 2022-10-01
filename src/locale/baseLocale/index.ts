import type { BaseCategory } from "./category.type";
import type { BaseCommands } from "./commands";
import type { BaseError } from "./error.type";
import type { BaseInteraction } from "./interaction.type";
import type { BaseLabels } from "./labels.type";
import type { BaseMessageActionRow } from "./components/messageActionRow.type";
import type { BaseMessageEmbed } from "./components/messageEmbed.type";
import type { BaseModule } from "./module.type";
import type { BaseStatus } from "./status.type";
import type { BaseUsage } from "./usage.type";

/**
 * When translating any file, check the variables available in the references within the BaseLocale interface.
 */
export default interface BaseLocale {
    localeLabel: string;
    category: BaseCategory;
    command: BaseCommands;
    error: BaseError;
    interaction: BaseInteraction;
    labels: BaseLabels;
    messageActionRow: BaseMessageActionRow;
    messageEmbed: BaseMessageEmbed;
    module: BaseModule;
    status: BaseStatus;
    usage: BaseUsage;
}