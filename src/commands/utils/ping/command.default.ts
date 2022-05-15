import { ExecuteCommand } from "../../index.types";
import ping from "./ping.func";

const execDefaultCommand: ExecuteCommand = async (message, args, options) => {
    await ping({ message, options });
}

export default execDefaultCommand;