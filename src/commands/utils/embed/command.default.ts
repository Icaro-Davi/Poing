import { IteratorFlags } from "../../../utils/regex/getValuesFromStringFlag";
import { ExecuteCommand } from "../../index.types";
import argument from "./command.args";
import CreateEmbedFromString from "./createEmbedFromString.func";

const execCommandDefault: ExecuteCommand = async (message, args, options) => {
    const flags = args.get(argument.FLAGS(options).name) as IteratorFlags;
    await CreateEmbedFromString({
        options, message,
        embedMessageFlags: flags,
    });
}

export default execCommandDefault;