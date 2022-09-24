import argument from "./command.args";
import memberInfo from "./memberInfo.func";

import type { ExecuteSlashCommand } from "../../index.types";
import type { GuildMember } from "discord.js";

const execSlashCommand: ExecuteSlashCommand = async function (interaction, options) {
    const SubCommand = interaction.options.getSubcommand();

    switch (SubCommand) {
        case argument.MEMBER(options).name:
            const member = interaction.options.getMember(argument.TARGET_MEMBER(options).name) as GuildMember;
            return { content: await memberInfo(member, options), type: 'embed', ephemeral: true };
    }
}

export default execSlashCommand;
