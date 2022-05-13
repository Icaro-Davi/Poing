import { Guild } from "discord.js";
import Mute from "../../../application/Mute";
import { list } from "../../../components/messageEmbed";
import { ExecuteCommandOptions } from "../../index.types";

const listMutedMembers = async ({ guild, options }: { guild: Guild, options: ExecuteCommandOptions }) => {
    const membersMuted = await Mute.listMutedMembers(guild);
    return list.mutedMembers(membersMuted, options);
}

export default listMutedMembers;