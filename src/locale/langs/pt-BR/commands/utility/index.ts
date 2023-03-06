import embed from './embed';
import getMembersStatus from './getMembersStatus';
import help from './help';
import info from './info';
import ping from './ping';
import warn from '../moderation/warn';

const utilityCommands = {
    embed,
    getMembersStatus,
    help,
    info,
    ping,
    warn
}

export default utilityCommands;