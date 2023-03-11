import memberInfo from "./memberInfo.func";

import { middleware } from "../../command.middleware";
import AnswerMember from "../../../utils/AnswerMember";

const execDefaultCommand = middleware.create('COMMAND', async function (message, args, options, next) {
    const data = options.context.data;
    if (data?.member) {
        await memberInfo(data.member, options, async (memberInfo) => {
            await AnswerMember({
                message, content: { embeds: [memberInfo] }
            });
        });
    }
    next();
});

export default execDefaultCommand;