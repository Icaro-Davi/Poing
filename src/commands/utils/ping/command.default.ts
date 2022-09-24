import ping from "./ping.func";

import type { ExecuteCommand } from "../../index.types";

const execDefaultCommand: ExecuteCommand = async function(message, args, options) {
    await ping({ message, options });
}


export default execDefaultCommand;