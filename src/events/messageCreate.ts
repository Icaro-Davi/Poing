import TextCommandModule from '../modules/textCommand.module';
import { createNewEvent } from '.';

export default createNewEvent('messageCreate', async (event, message) => {
    try {
        const promises: any[] = [];
        promises.push(TextCommandModule.validateEvent(event, true).exec(message));
        await Promise.all(promises);
    } catch (error) {
        console.log('[EVENT_MESSAGE_CREATE] error on src.events.messageCreate \n', error);
    }
});