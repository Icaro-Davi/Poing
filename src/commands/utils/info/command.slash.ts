import argument from "./command.args";
import memberInfo from "./memberInfo.func";

import AnswerMember from "../../../utils/AnswerMember";
import { middleware } from "../../command.middleware";

const execSlashCommand = middleware.create('COMMAND_INTERACTION', async function (interaction, options, next) {
    const subCommand = options.context.argument?.subCommand;
    const data = options.context.data;
    switch (subCommand) {
        case argument.MEMBER(options).name:
            const member = data.member;
            await memberInfo(member, options, async (embed) => {
                await AnswerMember({
                    interaction, content: { embeds: [embed] }
                });
            });
    }
    next();
});

export default execSlashCommand;
