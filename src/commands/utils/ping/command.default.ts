import ping from "./ping.func";

import { middleware } from "../../command.middleware";

const execDefaultCommand = middleware.create('COMMAND', async function (message, args, options, next) {
    await ping({ message, options });
    next();
});


export default execDefaultCommand;