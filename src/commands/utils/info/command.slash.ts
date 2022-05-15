import { GuildMember } from "discord.js";
import { ExecuteSlashCommand } from "../../index.types";
import argument from "./command.args";
import memberInfo from "./memberInfo.func";

const execSlashCommand: ExecuteSlashCommand = async (interaction, options) => {

    const SubCommand = interaction.options.getSubcommand();

    switch (SubCommand) {
        case argument.MEMBER.name:
            const member = interaction.options.getMember(argument.TARGET_MEMBER.name) as GuildMember;
            return { content: await memberInfo(member, options), type: 'embed', ephemeral: true };
    }
}

export default execSlashCommand;
