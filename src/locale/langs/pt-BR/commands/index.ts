import type { BaseCommands } from "../../../baseLocale/commands";

import adminCommands from "./admin";
import moderationCommands from "./moderation";
import utilityCommands from "./utility";

const commands: BaseCommands = {
    ...adminCommands,
   ...moderationCommands,
   ...utilityCommands
}


export default commands;